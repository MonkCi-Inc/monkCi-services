import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { 
  findUserById, 
  findInstallationById, 
  findRepositoriesByInstallationId,
  upsertRepository,
  Installation,
  Repository
} from '@/lib/db';

const GITHUB_APP_ID = process.env.GITHUB_APP_ID;
const GITHUB_PRIVATE_KEY = process.env.GITHUB_PRIVATE_KEY;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface InstallationTokenResponse {
  token: string;
  expires_at: string;
  permissions: Record<string, string>;
  repositories?: Array<{
    id: number;
    name: string;
    full_name: string;
  }>;
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

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const token = request.cookies.get('monkci_token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const { installationId } = await request.json();

    if (!installationId) {
      return NextResponse.json({ error: 'Installation ID is required' }, { status: 400 });
    }

    // Check if user has access to this installation
    const userInstallations = decoded.installations || [];
    const hasAccess = userInstallations.some((inst: any) => inst.id === installationId);
    
    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied to this installation' }, { status: 403 });
    }

    // Get installation from database
    const installation = await findInstallationById(installationId);
    if (!installation) {
      return NextResponse.json({ error: 'Installation not found' }, { status: 404 });
    }

    // Get repositories from database
    const repositories = await findRepositoriesByInstallationId(installation._id!);

    // Generate JWT for GitHub App to get fresh data
    const now = Math.floor(Date.now() / 1000);
    const appJwt = jwt.sign(
      {
        iat: now,
        exp: now + (10 * 60), // 10 minutes
        iss: GITHUB_APP_ID,
      },
      GITHUB_PRIVATE_KEY,
      { algorithm: 'RS256' }
    );

    // Get installation access token
    const tokenResponse = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${appJwt}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!tokenResponse.ok) {
      console.error('GitHub installation token error:', await tokenResponse.text());
      return NextResponse.json(
        { error: 'Failed to get installation token' },
        { status: 500 }
      );
    }

    const tokenData: InstallationTokenResponse = await tokenResponse.json();

    // Get fresh repositories from GitHub
    const reposResponse = await fetch(
      `https://api.github.com/installation/repositories`,
      {
        headers: {
          'Authorization': `Bearer ${tokenData.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    let freshRepositories: GitHubRepository[] = [];
    if (reposResponse.ok) {
      const reposData = await reposResponse.json();
      freshRepositories = reposData.repositories || [];

      // Sync repositories with database
      for (const repo of freshRepositories) {
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

    // Get updated repositories from database
    const updatedRepositories = await findRepositoriesByInstallationId(installation._id!);

    return NextResponse.json({
      installationToken: tokenData.token,
      expiresAt: tokenData.expires_at,
      permissions: tokenData.permissions,
      repositories: updatedRepositories.map(repo => ({
        id: repo.repositoryId,
        name: repo.name,
        full_name: repo.fullName,
        private: repo.private,
        description: repo.description,
        language: repo.language,
        archived: repo.archived,
        disabled: repo.disabled,
        fork: repo.fork,
        size: repo.size,
        stargazers_count: repo.stargazersCount,
        watchers_count: repo.watchersCount,
        forks_count: repo.forksCount,
        open_issues_count: repo.openIssuesCount,
        created_at: repo.createdAt.toISOString(),
        updated_at: repo.updatedAt.toISOString(),
        pushed_at: repo.pushedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('Installation token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate installation token' },
      { status: 500 }
    );
  }
} 