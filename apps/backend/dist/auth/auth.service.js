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
            const accessToken = await this.githubService.exchangeCodeForToken(code);
            const userData = await this.githubService.getUserInfo(accessToken);
            let user = await this.usersService.findByGithubId(userData.id);
            if (user) {
                user = await this.usersService.updateByGithubId(userData.id, {
                    login: userData.login,
                    name: userData.name,
                    email: userData.email,
                    avatarUrl: userData.avatar_url,
                    accessToken,
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
                });
            }
            const installations = await this.githubService.getUserInstallations(accessToken);
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
        }
        catch (error) {
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
        }
        catch (error) {
            console.error(`Failed to sync repositories for installation ${installation.installationId}:`, error);
        }
    }
    async getInstallationOctokit(installationId, userId) {
        const installation = await this.installationsService.findByInstallationId(installationId);
        if (!installation || installation.userId.toString() !== userId) {
            throw new common_1.UnauthorizedException('Access denied to this installation');
        }
        return await this.githubService.getInstallationOctokit(installationId);
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