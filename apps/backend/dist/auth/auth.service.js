"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const installations_service_1 = require("../installations/installations.service");
const repositories_service_1 = require("../repositories/repositories.service");
const github_service_1 = require("../github/github.service");
let AuthService = class AuthService {
    constructor(usersService, installationsService, repositoriesService, githubService, jwtService) {
        this.usersService = usersService;
        this.installationsService = installationsService;
        this.repositoriesService = repositoriesService;
        this.githubService = githubService;
        this.jwtService = jwtService;
    }
    async validateGithubCode(code) {
        try {
            if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
                console.warn('Missing GitHub OAuth credentials. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.');
            }
            if (!process.env.GITHUB_APP_ID || !process.env.GITHUB_PRIVATE_KEY) {
                console.warn('Missing GitHub App credentials. Please set GITHUB_APP_ID and GITHUB_PRIVATE_KEY environment variables.');
            }
            const accessToken = await this.githubService.exchangeCodeForToken(code);
            const userData = await this.githubService.getUserInfo(accessToken);
            const userOrganizations = await this.githubService.getUserOrganizations(accessToken, userData.organizations_url);
            const userRepositories = await this.githubService.getUserRepositories(accessToken, userData.repos_url);
            let user = await this.usersService.findByGithubId(userData.id);
            if (user) {
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
            }
            else {
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
            await this.syncUserRepositories(user['id'].toString(), userRepositories);
            const installations = await this.githubService.getAllInstallations(accessToken);
            const processedInstallations = [];
            for (const installation of installations) {
                let dbInstallation = await this.installationsService.findByInstallationId(installation.id);
                if (dbInstallation) {
                    dbInstallation = await this.installationsService.updateByInstallationId(installation.id, {
                        accountLogin: installation.account.login,
                        accountType: installation.account.type,
                        permissions: installation.permissions,
                        repositorySelection: installation.repository_selection,
                    });
                }
                else {
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
                    await this.syncRepositoriesForInstallation(dbInstallation);
                }
            }
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
        }
        catch (error) {
            console.log('error in validateGithubCode', error);
            throw new common_1.UnauthorizedException('Authentication failed: ' + error.message);
        }
    }
    async generateInstallationToken(installationId, userId) {
        try {
            const installation = await this.installationsService.findByInstallationId(installationId);
            if (!installation || installation.userId.toString() !== userId) {
                throw new common_1.UnauthorizedException('Access denied to this installation');
            }
            const octokit = await this.githubService.getInstallationOctokit(installationId);
            return {
                installation_id: installationId,
                octokit_authenticated: true,
                permissions: installation.permissions,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Failed to generate installation token: ' + error.message);
        }
    }
    async syncRepositoriesForInstallation(installation) {
        try {
            console.log(`Auth Service - Starting repository sync for installation ${installation.installationId}`);
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
                }
                catch (repoError) {
                    console.error(`Auth Service - Failed to sync repository ${repo.full_name}:`, repoError);
                }
            }
            console.log(`Auth Service - Completed repository sync for installation ${installation.installationId}`);
        }
        catch (error) {
            console.error(`Failed to sync repositories for installation ${installation.installationId}:`, error);
        }
    }
    async syncUserRepositories(userId, repositories) {
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
                }
                catch (repoError) {
                    console.error(`Auth Service - Failed to sync user repository ${repo.full_name}:`, repoError);
                }
            }
            console.log(`Auth Service - Completed user repository sync`);
        }
        catch (error) {
            console.error(`Failed to sync user repositories:`, error);
        }
    }
    async getInstallationOctokit(installationId, userId) {
        const installation = await this.installationsService.findByInstallationId(installationId);
        if (!installation || installation.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException('Access denied to this installation');
        }
        return await this.githubService.getInstallationOctokit(installationId);
    }
    async getUserWithToken(userId) {
        return this.usersService.findOne(userId);
    }
    get githubServiceAccess() {
        return this.githubService;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        installations_service_1.InstallationsService,
        repositories_service_1.RepositoriesService,
        github_service_1.GitHubService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map