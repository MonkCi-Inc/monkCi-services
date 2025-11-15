import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { GitHubService } from '../github/github.service';
import { EmailAuthService } from '../users/email-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private githubService: GitHubService,
    private emailAuthService: EmailAuthService,
    private jwtService: JwtService,
  ) {}

  async loginWithEmailPassword(email: string, password: string) {
    try {
      // Validate against EmailAuth collection (handles all users including demo)
      const emailAuth = await this.emailAuthService.validatePassword(email, password);
      if (!emailAuth) {
        throw new UnauthorizedException('Invalid email or password');
      }

      // Create JWT payload - only include email auth data, not GitHub data
      const payload: any = {
        emailAuthId: emailAuth['id'].toString(),
        email: emailAuth.email,
        name: emailAuth.name,
      };

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        emailAuth: {
          id: emailAuth['id'],
          email: emailAuth.email,
          name: emailAuth.name,
        },
        user: null,
        hasGitHubLinked: false,
      };
    } catch (error) {
      console.log('error in loginWithEmailPassword', error);
      throw new UnauthorizedException('Login failed: ' + error.message);
    }
  }

  async registerWithEmailPassword(email: string, password: string, name?: string) {
    try {
      // Create EmailAuth record
      const emailAuth = await this.emailAuthService.create({
        email,
        password,
        name,
      });

      // Create JWT payload
      const payload = {
        emailAuthId: emailAuth['id'].toString(),
        email: emailAuth.email,
        name: emailAuth.name,
      };

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        emailAuth: {
          id: emailAuth['id'],
          email: emailAuth.email,
          name: emailAuth.name,
        },
        user: null,
        hasGitHubLinked: false,
      };
    } catch (error) {
      console.log('error in registerWithEmailPassword', error);
      throw new UnauthorizedException('Registration failed: ' + error.message);
    }
  }

  async validateGithubCode(code: string, mode: 'login' | 'connect' = 'login', emailAuthId?: string) {
    try {
      // Check for required environment variables
      if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        console.warn('Missing GitHub OAuth credentials. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.');
      }
      
      if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
        console.warn('Missing GitHub App credentials. Please set GITHUB_APP_ID and GITHUB_PRIVATE_KEY environment variables.');
      }

      // Exchange code for access token using GitHubService
      const accessToken = await this.githubService.exchangeCodeForToken(code);
      
      console.log('accessToken', accessToken);

      // Get user information using GitHubService 
      const userData = await this.githubService.getUserInfo(accessToken);
      
      // Get user's organizations using GitHubService
      const userOrganizations = await this.githubService.getUserOrganizations(accessToken, userData.organizations_url);
      
      // Get user's repositories using GitHubService
      const userRepositories = await this.githubService.getUserRepositories(accessToken, userData.repos_url);

      // Check if user exists in database
      let user = await this.usersService.findByGithubId(userData.id);
      
      console.log('🔍 GitHub Login - Checking if user exists:', {
        githubId: userData.id,
        login: userData.login,
        userFound: !!user,
        mode: mode
      });
      // If mode is "connect", link GitHub account to email auth
      let emailAuth = null;
      if (mode === 'connect' && emailAuthId) {
        emailAuth = await this.emailAuthService.findById(emailAuthId);
        if (!emailAuth) {
          throw new UnauthorizedException('EmailAuth not found');
        }
      }

      if (user) {
        // Update existing user
        console.log('✅ GitHub Login - User EXISTS, UPDATING user record:', {
          userId: user['id'],
          emailAuthId: emailAuth ? emailAuth['id'] : null,
          emailAuthExists: !!emailAuth,
          emailAuthLinked: !!user.emailAuthId
        });
        // If mode is "connect", link email auth to this user
        if (mode === 'connect' && emailAuth && !user.emailAuthId) {
          await this.usersService.linkEmailAuth(user['id'].toString(), emailAuth._id.toString());
          await this.emailAuthService.linkToUser(emailAuth._id.toString(), user['id'].toString());
          user = await this.usersService.findOne(user['id'].toString());
        }
        user = await this.usersService.updateByGithubId(userData.id, {
          login: userData.login,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatar_url,
          accessToken,
          nodeId: userData.node_id,
          gravatarId: userData.gravatar_id,
          url: userData.url,
          htmlUrl: userData.html_url,
          followersUrl: userData.followers_url,
          followingUrl: userData.following_url,
          gistsUrl: userData.gists_url,
          starredUrl: userData.starred_url,
          subscriptionsUrl: userData.subscriptions_url,
          organizationsUrl: userData.organizations_url,
          reposUrl: userData.repos_url,
          eventsUrl: userData.events_url,
          receivedEventsUrl: userData.received_events_url,
          type: userData.type,
          userViewType: userData.user_view_type,
          siteAdmin: userData.site_admin,
          company: userData.company,
          blog: userData.blog,
          location: userData.location,
          hireable: userData.hireable,
          bio: userData.bio,
          twitterUsername: userData.twitter_username,
          notificationEmail: userData.notification_email,
          publicRepos: userData.public_repos,
          publicGists: userData.public_gists,
          followers: userData.followers,
          following: userData.following,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        });
      } else {
        // Create new user
        const createUserDto: any = {
          githubId: userData.id,
          login: userData.login,
          name: userData.name,
          email: userData.email,
          avatarUrl: userData.avatar_url,
          accessToken,
          nodeId: userData.node_id,
          gravatarId: userData.gravatar_id,
          url: userData.url,
          htmlUrl: userData.html_url,
          followersUrl: userData.followers_url,
          followingUrl: userData.following_url,
          gistsUrl: userData.gists_url,
          starredUrl: userData.starred_url,
          subscriptionsUrl: userData.subscriptions_url,
          organizationsUrl: userData.organizations_url,
          reposUrl: userData.repos_url,
          eventsUrl: userData.events_url,
          receivedEventsUrl: userData.received_events_url,
          type: userData.type,
          userViewType: userData.user_view_type,
          siteAdmin: userData.site_admin,
          company: userData.company,
          blog: userData.blog,
          location: userData.location,
          hireable: userData.hireable,
          bio: userData.bio,
          twitterUsername: userData.twitter_username,
          notificationEmail: userData.notification_email,
          publicRepos: userData.public_repos,
          publicGists: userData.public_gists,
          followers: userData.followers,
          following: userData.following,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        };

        // If mode is "connect", link email auth to the new user
        if (mode === 'connect' && emailAuth) {
          createUserDto.emailAuthId = emailAuth['id'];
        }

        user = await this.usersService.create(createUserDto);

        // Link EmailAuth to User bidirectionally if connect mode
        if (mode === 'connect' && emailAuth) {
          await this.emailAuthService.linkToUser(emailAuth['id'].toString(), user['id'].toString());
        }
      }

      // Get user's installations using GitHubService (no database storage)
      const installations = await this.githubService.getAllInstallations(accessToken);
      console.log('installations', installations);

      // Format installations for response (no database operations)
      const processedInstallations = installations.map((installation) => ({
        id: installation.id,
        accountLogin: installation.account.login,
        accountType: installation.account.type,
        permissions: installation.permissions,
        repositorySelection: installation.repository_selection,
        appSlug: installation.app_slug,
      }));

      // If mode is "connect", return email auth JWT (don't switch login method)
      if (mode === 'connect' && emailAuth) {
        // Create email auth JWT payload with GitHub data included
        const emailPayload: any = {
          emailAuthId: emailAuth['id'].toString(),
          email: emailAuth.email,
          name: emailAuth.name,
          // Include GitHub data so UI knows GitHub is connected
          userId: user['id'].toString(),
          githubId: user.githubId,
          login: user.login,
          avatarUrl: user.avatarUrl,
          installations: processedInstallations,
        };

        const emailToken = this.jwtService.sign(emailPayload);

        return {
          access_token: emailToken,
          user: {
            id: user['id'],
            githubId: user.githubId,
            login: user.login,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
          },
          installations: processedInstallations,
        };
      }

      // Normal login mode - return GitHub JWT
      const payload: any = {
        userId: user['id'].toString(),
        githubId: user.githubId,
        login: user.login,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        installations: processedInstallations,
      };

      // Include emailAuthId if linked (for users who connected GitHub after email login)
      if (user.emailAuthId) {
        payload.emailAuthId = user.emailAuthId.toString();
      }

      console.log('Auth Service - Creating JWT with payload:', {
        userId: payload.userId,
        githubId: payload.githubId,
        login: payload.login,
        installationsCount: payload.installations.length
      });

      const token = this.jwtService.sign(payload);

      return {
        access_token: token,
        user: {
          id: user['id'],
          githubId: user.githubId,
          login: user.login,
          name: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        },
        installations: processedInstallations,
      };
    } catch (error) {
      console.log('error in validateGithubCode', error);
      throw new UnauthorizedException('Authentication failed: ' + error.message);
    }
  }

  async generateInstallationToken(installationId: number, userId: string) {
    try {
      // Get user to verify they exist
      const user = await this.usersService.findOne(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Get installation access token using GitHubService
      // No need to verify from database - GitHub API will handle authorization
      const octokit = await this.githubService.getInstallationOctokit(installationId);
      
      // The octokit instance is already authenticated for this installation
      // You can use it directly for API calls
      return {
        installation_id: installationId,
        octokit_authenticated: true,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate installation token: ' + error.message);
    }
  }

  // Removed database sync methods - repositories are fetched directly from GitHub API

  async getInstallationOctokit(installationId: number, userId: string): Promise<any> {
    // Get user to verify they exist
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Verify user has access to this installation by checking their installations
    const userInstallations = await this.getUserInstallations(userId);
    const hasAccess = userInstallations.some(inst => inst.id === installationId);
    
    if (!hasAccess) {
      throw new UnauthorizedException('Access denied to this installation');
    }

    // Return authenticated Octokit instance for this installation
    return await this.githubService.getInstallationOctokit(installationId);
  }

  async getUserWithToken(userId: string) {
    return this.usersService.findOne(userId);
  }

  // Get installations for a user using their stored accessToken (no database storage)
  async getUserInstallations(userId: string) {
    try {
      // Get user to access their accessToken
      const user = await this.usersService.findOne(userId);
      if (!user || !user.accessToken) {
        throw new UnauthorizedException('User not found or no GitHub access token available');
      }

      // Get fresh installations from GitHub API
      const installations = await this.githubService.getAllInstallations(user.accessToken);
      console.log('Auth Service - Fetched installations from GitHub, found:', installations.length);

      // Format installations for response (no database operations)
      const processedInstallations = installations.map((installation) => ({
        id: installation.id,
        accountLogin: installation.account.login,
        accountType: installation.account.type,
        permissions: installation.permissions,
        repositorySelection: installation.repository_selection,
        appSlug: installation.app_slug,
      }));

      return processedInstallations;
    } catch (error) {
      console.error('Auth Service - Failed to fetch installations:', error);
      throw new UnauthorizedException('Failed to fetch installations: ' + error.message);
    }
  }

  // Get a single installation by GitHub installation ID (no database storage)
  async getUserInstallationById(userId: string, installationId: number) {
    try {
      // Get all installations for the user
      const allInstallations = await this.getUserInstallations(userId);
      
      // Find the installation with matching ID
      const installation = allInstallations.find(inst => inst.id === installationId);
      
      if (!installation) {
        throw new UnauthorizedException('Installation not found or access denied');
      }

      return installation;
    } catch (error) {
      console.error('Auth Service - Failed to fetch installation:', error);
      throw new UnauthorizedException('Failed to fetch installation: ' + error.message);
    }
  }

  // Get repositories for installations (no database storage)
  async getUserRepositories(userId: string, installationId?: number) {
    try {
      // Get user to access their accessToken
      const user = await this.usersService.findOne(userId);
      if (!user || !user.accessToken) {
        throw new UnauthorizedException('User not found or no GitHub access token available');
      }

      // Get user's installations
      const installations = await this.getUserInstallations(userId);
      
      // If installationId is specified, get repositories for that installation only
      if (installationId) {
        const installation = installations.find(inst => inst.id === installationId);
        if (!installation) {
          throw new UnauthorizedException('Installation not found or access denied');
        }
        const repositories = await this.githubService.getInstallationRepositories(installationId);
        return repositories.map(repo => ({
          id: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          private: repo.private,
          description: repo.description,
          defaultBranch: repo.default_branch,
          language: repo.language,
          topics: repo.topics || [],
          archived: repo.archived,
          disabled: repo.disabled,
          fork: repo.fork,
          size: repo.size,
          stargazersCount: repo.stargazers_count,
          watchersCount: repo.watchers_count,
          forksCount: repo.forks_count,
          openIssuesCount: repo.open_issues_count,
          createdAt: repo.created_at,
          updatedAt: repo.updated_at,
          pushedAt: repo.pushed_at,
          installationId: installationId,
        }));
      }

      // Get repositories for all installations
      const allRepositories = [];
      for (const installation of installations) {
        try {
          const repositories = await this.githubService.getInstallationRepositories(installation.id);
          const formattedRepos = repositories.map(repo => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            private: repo.private,
            description: repo.description,
            defaultBranch: repo.default_branch,
            language: repo.language,
            topics: repo.topics || [],
            archived: repo.archived,
            disabled: repo.disabled,
            fork: repo.fork,
            size: repo.size,
            stargazersCount: repo.stargazers_count,
            watchersCount: repo.watchers_count,
            forksCount: repo.forks_count,
            openIssuesCount: repo.open_issues_count,
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            pushedAt: repo.pushed_at,
            installationId: installation.id,
          }));
          allRepositories.push(...formattedRepos);
        } catch (error) {
          console.error(`Failed to fetch repositories for installation ${installation.id}:`, error);
          // Continue with other installations
        }
      }

      return allRepositories;
    } catch (error) {
      console.error('Auth Service - Failed to fetch repositories:', error);
      throw new UnauthorizedException('Failed to fetch repositories: ' + error.message);
    }
  }

  // Get a single repository by GitHub repository ID (no database storage)
  async getUserRepositoryById(userId: string, repositoryId: number) {
    try {
      // Get all repositories for the user
      const allRepositories = await this.getUserRepositories(userId);
      
      // Find the repository with matching ID
      const repository = allRepositories.find(repo => repo.id === repositoryId);
      
      if (!repository) {
        throw new UnauthorizedException('Repository not found or access denied');
      }

      return repository;
    } catch (error) {
      console.error('Auth Service - Failed to fetch repository:', error);
      throw new UnauthorizedException('Failed to fetch repository: ' + error.message);
    }
  }

  // Make githubService accessible for debugging
  get githubServiceAccess() {
    return this.githubService;
  }
} 