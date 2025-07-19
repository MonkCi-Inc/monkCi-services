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
exports.RunnersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const runners_service_1 = require("./runners.service");
const create_runner_dto_1 = require("./dto/create-runner.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RunnersController = class RunnersController {
    constructor(runnersService) {
        this.runnersService = runnersService;
    }
    async create(createRunnerDto, req) {
        return this.runnersService.create(createRunnerDto, req.user.userId);
    }
    async register(registerRunnerDto) {
        return this.runnersService.registerRunner(registerRunnerDto);
    }
    async findAll(req) {
        return this.runnersService.findAll(req.user.userId);
    }
    async getAvailableRunners(req) {
        return this.runnersService.getAvailableRunners();
    }
    async findOne(id) {
        return this.runnersService.findOne(id);
    }
    async update(id, updateRunnerDto) {
        return this.runnersService.update(id, updateRunnerDto);
    }
    async remove(id) {
        return this.runnersService.remove(id);
    }
    async updateStatus(runnerId, body) {
        return this.runnersService.updateStatus(runnerId, body.status);
    }
    async heartbeat(runnerId, body) {
        return this.runnersService.heartbeat(runnerId, body?.systemInfo);
    }
    async assignJob(runnerId, jobData) {
        return this.runnersService.assignJob(runnerId, jobData);
    }
    async completeJob(runnerId, body) {
        return this.runnersService.completeJob(runnerId, body.jobId, body.status, body.duration);
    }
    async generateRegistrationToken(req) {
        const token = await this.runnersService.generateRegistrationTokenForUser(req.user.userId);
        return { registrationToken: token };
    }
};
exports.RunnersController = RunnersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new runner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Runner created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_runner_dto_1.CreateRunnerDto, Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a runner with a registration token' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Runner registered successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_runner_dto_1.RegisterRunnerDto]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "register", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all runners for the authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Runners retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get available runners for job assignment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available runners retrieved successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "getAvailableRunners", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific runner by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Runner retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a runner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Runner updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_runner_dto_1.UpdateRunnerDto]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a runner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Runner deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':runnerId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update runner status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Runner status updated successfully' }),
    __param(0, (0, common_1.Param)('runnerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)(':runnerId/heartbeat'),
    (0, swagger_1.ApiOperation)({ summary: 'Send heartbeat from runner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Heartbeat received successfully' }),
    __param(0, (0, common_1.Param)('runnerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "heartbeat", null);
__decorate([
    (0, common_1.Post)(':runnerId/assign-job'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a job to a runner' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job assigned successfully' }),
    __param(0, (0, common_1.Param)('runnerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "assignJob", null);
__decorate([
    (0, common_1.Post)(':runnerId/complete-job'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark a job as completed' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Job completed successfully' }),
    __param(0, (0, common_1.Param)('runnerId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "completeJob", null);
__decorate([
    (0, common_1.Post)('generate-token'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a registration token for a new runner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Registration token generated successfully' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RunnersController.prototype, "generateRegistrationToken", null);
exports.RunnersController = RunnersController = __decorate([
    (0, swagger_1.ApiTags)('runners'),
    (0, common_1.Controller)('runners'),
    __metadata("design:paramtypes", [runners_service_1.RunnersService])
], RunnersController);
//# sourceMappingURL=runners.controller.js.map