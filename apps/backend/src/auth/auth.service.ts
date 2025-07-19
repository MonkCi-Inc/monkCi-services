import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { InstallationsService } from '../installations/installations.service';
import { RepositoriesService } from '../repositories/repositories.service';
import { GitHubService } from '../github/github.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private installationsService: InstallationsService,
    private repositoriesService: RepositoriesService,
    private githubService: GitHubService,
    private jwtService: JwtService,
  ) {}

  async validateGithubCode(code: string) {
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

      if (user) {
        // Update existing user
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
        user = await this.usersService.create({
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
        });
      }

      // Sync user repositories
      await this.syncUserRepositories(user['id'].toString(), userRepositories);

      // Get user's installations using GitHubService
      const installations = await this.githubService.getAllInstallations(accessToken);

      console.log('installations', installations);

      // Process each installation
      const processedInstallations = [];
      for (const installation of installations) {
        
        let dbInstallation = await this.installationsService.findByInstallationId(
          installation.id,
        );

        if (dbInstallation) {
          // Update existing installation
          dbInstallation = await this.installationsService.updateByInstallationId(
            installation.id,
            {
              accountLogin: installation.account.login,
              accountType: installation.account.type,
              permissions: installation.permissions,
              repositorySelection: installation.repository_selection,
            },
          );
        } else {
          // Create new installation
          dbInstallation = await this.installationsService.create({
            installationId: installation.id,
            userId: user['id'].toString(),
            accountLogin: installation.account.login,
            accountType: installation.account.type,
            permissions: installation.permissions,
            repositorySelection: installation.repository_selection,
          });
        }

        if (dbInstallation) {
          processedInstallations.push(dbInstallation);
          // Sync repositories for this installation using GitHubService
          await this.syncRepositoriesForInstallation(dbInstallation);
        }
      }

      // Create JWT token
      const payload = {
        userId: user['id'].toString(),
        githubId: user.githubId,
        login: user.login,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        installations: processedInstallations.map((inst) => ({
          id: inst.installationId,
          accountLogin: inst.accountLogin,
          accountType: inst.accountType,
          permissions: inst.permissions,
          repositorySelection: inst.repositorySelection,
        })),
      };

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
      // Verify user has access to this installation
      const installation = await this.installationsService.findByInstallationId(
        installationId,
      );

      if (!installation || installation.userId.toString() !== userId) {
        throw new UnauthorizedException('Access denied to this installation');
      }

      // Get installation access token using GitHubService
      const octokit = await this.githubService.getInstallationOctokit(installationId);
      
      // The octokit instance is already authenticated for this installation
      // You can use it directly for API calls
      return {
        installation_id: installationId,
        octokit_authenticated: true,
        permissions: installation.permissions,
      };
    } catch (error) {
      throw new UnauthorizedException('Failed to generate installation token: ' + error.message);
    }
  }

  async syncRepositoriesForInstallation(installation: any) {
    try {
      console.log(`Auth Service - Starting repository sync for installation ${installation.installationId}`);
      
      // Get repositories using GitHubService with Octokit
      const repositories = await this.githubService.getInstallationRepositories(installation.installationId);
      console.log(`Auth Service - Found ${repositories.length} repositories for installation ${installation.installationId}`);

      for (const repo of repositories) {
        console.log(`Auth Service - Syncing repository: ${repo.full_name} (ID: ${repo.id})`);
        
        try {
          await this.repositoriesService.upsertRepository({
            repositoryId: repo.id,
            installationId: installation._id.toString(),
            userId: installation.userId.toString(),
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
          });
          console.log(`Auth Service - Successfully synced repository: ${repo.full_name}`);
        } catch (repoError) {
          console.error(`Auth Service - Failed to sync repository ${repo.full_name}:`, repoError);
        }
      }
      
      console.log(`Auth Service - Completed repository sync for installation ${installation.installationId}`);
    } catch (error) {
      console.error(`Failed to sync repositories for installation ${installation.installationId}:`, error);
    }
  }

  async syncUserRepositories(userId: string, repositories: any[]) {
    try {
      console.log(`Auth Service - Starting to sync ${repositories.length} user repositories`);
      
      for (const repo of repositories) {
        console.log(`Auth Service - Syncing user repository: ${repo.full_name} (ID: ${repo.id})`);
        
        try {
          await this.repositoriesService.upsertRepository({
            repositoryId: repo.id,
            userId: userId,
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
            // Additional GitHub repository data
            nodeId: repo.node_id,
            htmlUrl: repo.html_url,
            url: repo.url,
            gitUrl: repo.git_url,
            sshUrl: repo.ssh_url,
            cloneUrl: repo.clone_url,
            svnUrl: repo.svn_url,
            homepage: repo.homepage,
            hasIssues: repo.has_issues,
            hasProjects: repo.has_projects,
            hasDownloads: repo.has_downloads,
            hasWiki: repo.has_wiki,
            hasPages: repo.has_pages,
            hasDiscussions: repo.has_discussions,
            mirrorUrl: repo.mirror_url,
            allowForking: repo.allow_forking,
            isTemplate: repo.is_template,
            webCommitSignoffRequired: repo.web_commit_signoff_required,
            visibility: repo.visibility,
            license: repo.license,
            permissions: repo.permissions,
            owner: repo.owner,
          });
          console.log(`Auth Service - Successfully synced user repository: ${repo.full_name}`);
        } catch (repoError) {
          console.error(`Auth Service - Failed to sync user repository ${repo.full_name}:`, repoError);
        }
      }
      
      console.log(`Auth Service - Completed user repository sync`);
    } catch (error) {
      console.error(`Failed to sync user repositories:`, error);
    }
  }

  async getInstallationOctokit(installationId: number, userId: string) {
    // Verify user has access to this installation
    const installation = await this.installationsService.findByInstallationId(installationId);
    
    if (!installation || installation.userId.toString() !== userId) {
      throw new UnauthorizedException('Access denied to this installation');
    }

    // Return authenticated Octokit instance for this installation
    return await this.githubService.getInstallationOctokit(installationId);
  }

  async getUserWithToken(userId: string) {
    return this.usersService.findOne(userId);
  }

  // Make githubService accessible for debugging
  get githubServiceAccess() {
    return this.githubService;
  }
} 