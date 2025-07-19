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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const repositories_service_1 = require("./repositories.service");
const create_repository_dto_1 = require("./dto/create-repository.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const github_service_1 = require("../github/github.service");
const installations_service_1 = require("../installations/installations.service");
let RepositoriesController = class RepositoriesController {
    constructor(repositoriesService, githubService, installationsService) {
        this.repositoriesService = repositoriesService;
        this.githubService = githubService;
        this.installationsService = installationsService;
    }
    create(createRepositoryDto) {
        return this.repositoriesService.create(createRepositoryDto);
    }
    findAll(installationId) {
        if (installationId) {
            return this.repositoriesService.findByInstallationId(installationId);
        }
        return this.repositoriesService.findAll();
    }
    findOne(id) {
        return this.repositoriesService.findOne(id);
    }
    update(id, updateRepositoryDto) {
        return this.repositoriesService.update(id, updateRepositoryDto);
    }
    remove(id) {
        return this.repositoriesService.remove(id);
    }
    async syncRepositories(installationId) {
        return this.repositoriesService.syncRepositoriesForInstallation(installationId);
    }
    async getRepositoryCount() {
        const count = await this.repositoriesService.getRepositoryCount();
        return { count };
    }
    async syncAllRepositories(user) {
        return this.repositoriesService.syncAllRepositoriesForUser(user.userId);
    }
    async getRepositoryRunners(id) {
        const repository = await this.repositoriesService.findOne(id);
        if (!repository.installationId) {
            return { runners: [], message: 'Repository not associated with an installation' };
        }
        const installation = repository.installationId;
        const [owner, repo] = repository.fullName.split('/');
        try {
            const runners = await this.githubService.getRepositoryRunners(installation.installationId, owner, repo);
            return { runners };
        }
        catch (error) {
            console.error('Error fetching repository runners:', error);
            return { runners: [], error: error.message };
        }
    }
    async getRepositoryWorkflows(id) {
        const repository = await this.repositoriesService.findOne(id);
        if (!repository.installationId) {
            return { workflows: [], message: 'Repository not associated with an installation' };
        }
        const installation = repository.installationId;
        const [owner, repo] = repository.fullName.split('/');
        try {
            const workflows = await this.githubService.getRepositoryWorkflows(installation.installationId, owner, repo);
            return { workflows };
        }
        catch (error) {
            console.error('Error fetching repository workflows:', error);
            return { workflows: [], error: error.message };
        }
    }
    async getWorkflowRuns(id, workflowId) {
        const repository = await this.repositoriesService.findOne(id);
        if (!repository.installationId) {
            return { runs: [], message: 'Repository not associated with an installation' };
        }
        const installation = repository.installationId;
        const [owner, repo] = repository.fullName.split('/');
        try {
            const runs = await this.githubService.getWorkflowRuns(installation.installationId, owner, repo, parseInt(workflowId));
            return { runs };
        }
        catch (error) {
            console.error('Error fetching workflow runs:', error);
            return { runs: [], error: error.message };
        }
    }
    async getWorkflowRunLogs(id, runId) {
        const repository = await this.repositoriesService.findOne(id);
        if (!repository.installationId) {
            return { logs: null, message: 'Repository not associated with an installation' };
        }
        const installation = repository.installationId;
        const [owner, repo] = repository.fullName.split('/');
        try {
            const logs = await this.githubService.getWorkflowRunLogs(installation.installationId, owner, repo, parseInt(runId));
            return { logs };
        }
        catch (error) {
            console.error('Error fetching workflow run logs:', error);
            return { logs: null, error: error.message };
        }
    }
};
exports.RepositoriesController = RepositoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new repository' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Repository created successfully.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_repository_dto_1.CreateRepositoryDto]),
    __metadata("design:returntype", void 0)
], RepositoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all repositories' }),
    (0, swagger_1.ApiQuery)({ name: 'installationId', required: false, description: 'Filter by installation ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all repositories.' }),
    __param(0, (0, common_1.Query)('installationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RepositoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a repository by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the repository.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RepositoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a repository' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Repository updated successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RepositoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a repository' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Repository deleted successfully.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RepositoriesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('sync/:installationId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Sync repositories for installation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Repositories synced successfully.' }),
    __param(0, (0, common_1.Param)('installationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RepositoriesController.prototype, "syncRepositories", null);
__decorate([
    (0, common_1.Get)('debug/count'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get repository count for debugging' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RepositoriesController.prototype, "getRepositoryCount", null);
__decorate([
    (0, common_1.Post)('sync/all'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Sync repositories for all installations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'All repositories synced successfully.' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RepositoriesController.prototype, "syncAllRepositories", null);
__decorate([
    (0, common_1.Get)(':id/runners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get GitHub Actions runners for a repository' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the repository runners.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RepositoriesController.prototype, "getRepositoryRunners", null);
__decorate([
    (0, common_1.Get)(':id/workflows'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get GitHub Actions workflows for a repository' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the repository workflows.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RepositoriesController.prototype, "getRepositoryWorkflows", null);
__decorate([
    (0, common_1.Get)(':id/workflows/:workflowId/runs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get GitHub Actions workflow runs for a specific workflow' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the workflow runs.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('workflowId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RepositoriesController.prototype, "getWorkflowRuns", null);
__decorate([
    (0, common_1.Get)(':id/runs/:runId/logs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get GitHub Actions workflow run logs for a specific run' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the workflow run logs.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('runId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RepositoriesController.prototype, "getWorkflowRunLogs", null);
exports.RepositoriesController = RepositoriesController = __decorate([
    (0, swagger_1.ApiTags)('repositories'),
    (0, common_1.Controller)('repositories'),
    __metadata("design:paramtypes", [repositories_service_1.RepositoriesService,
        github_service_1.GitHubService,
        installations_service_1.InstallationsService])
], RepositoriesController);
//# sourceMappingURL=repositories.controller.js.map