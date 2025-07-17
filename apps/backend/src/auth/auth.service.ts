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
      // Exchange code for access token using GitHubService
      const accessToken = await this.githubService.exchangeCodeForToken(code);

      // Get user information using GitHubService
      const userData = await this.githubService.getUserInfo(accessToken);

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
        });
      }

      // Get user's installations using GitHubService
      const installations = await this.githubService.getUserInstallations(accessToken);

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

      return {
        access_token: this.jwtService.sign(payload),
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
      // Get repositories using GitHubService with Octokit
      const repositories = await this.githubService.getInstallationRepositories(installation.installationId);

      for (const repo of repositories) {
        await this.repositoriesService.upsertRepository({
          repositoryId: repo.id,
          installationId: installation._id.toString(),
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
      }
    } catch (error) {
      console.error(`Failed to sync repositories for installation ${installation.installationId}:`, error);
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
} 