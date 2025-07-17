import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { 
  createUser, 
  updateUser, 
  findUserByGithubId, 
  createInstallation, 
  findInstallationById,
  upsertRepository,
  User,
  Installation,
  Repository
} from '@/lib/db';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI || `${process.env.NEXTAUTH_URL}/api/auth/github/callback`;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface GitHubInstallation {
  id: number;
  account: {
    login: string;
    type: 'User' | 'Organization';
  };
  permissions: Record<string, string>;
  repository_selection: 'all' | 'selected';
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  description: string | null;
  default_branch: string;
  language: string | null;
  topics: string[];
  archived: boolean;
  disabled: boolean;
  fork: boolean;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/error?error=${encodeURIComponent(error)}`
      );
    }

    // Verify state parameter
    const storedState = request.cookies.get('github_oauth_state')?.value;
    if (!state || !storedState || state !== storedState) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/error?error=${encodeURIComponent('Invalid state parameter')}`
      );
    }

    if (!code) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/error?error=${encodeURIComponent('No authorization code received')}`
      );
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub token exchange error:', tokenData);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/auth/error?error=${encodeURIComponent(tokenData.error_description || 'Token exchange failed')}`
      );
    }

    const accessToken = tokenData.access_token;

    // Get user information
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData: GitHubUser = await userResponse.json();

    // Check if user exists in database
    let user = await findUserByGithubId(userData.id);
    
    if (user) {
      // Update existing user
      user = await updateUser(userData.id, {
        login: userData.login,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatar_url,
        accessToken,
      });
    } else {
      // Create new user
      user = await createUser({
        githubId: userData.id,
        login: userData.login,
        name: userData.name,
        email: userData.email,
        avatarUrl: userData.avatar_url,
        accessToken,
      });
    }

    if (!user) {
      throw new Error('Failed to create or update user');
    }

    // Get user's installations
    const installationsResponse = await fetch('https://api.github.com/user/installations', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const installationsData = await installationsResponse.json();
    const installations: GitHubInstallation[] = installationsData.installations || [];

    // Process each installation
    const processedInstallations = [];
    
    for (const installation of installations) {
      // Check if installation exists in database
      let dbInstallation = await findInstallationById(installation.id);
      
      if (dbInstallation) {
        // Update existing installation
        dbInstallation = await updateInstallation(installation.id, {
          accountLogin: installation.account.login,
          accountType: installation.account.type,
          permissions: installation.permissions,
          repositorySelection: installation.repository_selection,
        });
      } else {
        // Create new installation
        dbInstallation = await createInstallation({
          installationId: installation.id,
          userId: user._id!,
          accountLogin: installation.account.login,
          accountType: installation.account.type,
          permissions: installation.permissions,
          repositorySelection: installation.repository_selection,
        });
      }

      if (dbInstallation) {
        processedInstallations.push(dbInstallation);
        
        // Get repositories for this installation
        await syncRepositoriesForInstallation(dbInstallation, accessToken);
      }
    }

    // Create JWT token with user data and installations
    const tokenPayload = {
      userId: user._id!.toString(),
      githubId: user.githubId,
      login: user.login,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      installations: processedInstallations.map(inst => ({
        id: inst.installationId,
        accountLogin: inst.accountLogin,
        accountType: inst.accountType,
        permissions: inst.permissions,
        repositorySelection: inst.repositorySelection,
      })),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7), // 7 days
    };

    const jwtToken = jwt.sign(tokenPayload, JWT_SECRET);

    // Create response with JWT token
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard`);

    // Set JWT token as httpOnly cookie
    response.cookies.set('monkci_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear the OAuth state cookie
    response.cookies.delete('github_oauth_state');

    return response;
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/auth/error?error=${encodeURIComponent('Authentication failed')}`
    );
  }
}

async function syncRepositoriesForInstallation(installation: Installation, accessToken: string) {
  try {
    // Get repositories for this installation
    const reposResponse = await fetch(
      `https://api.github.com/installation/repositories`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (reposResponse.ok) {
      const reposData = await reposResponse.json();
      const repositories: GitHubRepository[] = reposData.repositories || [];

      // Sync each repository
      for (const repo of repositories) {
        await upsertRepository({
          repositoryId: repo.id,
          installationId: installation._id!,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          description: repo.description || undefined,
          defaultBranch: repo.default_branch,
          language: repo.language || undefined,
          topics: repo.topics || [],
          archived: repo.archived,
          disabled: repo.disabled,
          fork: repo.fork,
          size: repo.size,
          stargazersCount: repo.stargazers_count,
          watchersCount: repo.watchers_count,
          forksCount: repo.forks_count,
          openIssuesCount: repo.open_issues_count,
          createdAt: new Date(repo.created_at),
          updatedAt: new Date(repo.updated_at),
          pushedAt: new Date(repo.pushed_at),
        });
      }
    }
  } catch (error) {
    console.error(`Failed to sync repositories for installation ${installation.installationId}:`, error);
  }
} 