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
exports.RunnersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const runner_schema_1 = require("./schemas/runner.schema");
const crypto_1 = require("crypto");
let RunnersService = class RunnersService {
    constructor(runnerModel) {
        this.runnerModel = runnerModel;
    }
    async create(createRunnerDto, userId) {
        const runnerId = this.generateRunnerId();
        const registrationToken = this.generateRegistrationToken();
        const runner = new this.runnerModel({
            ...createRunnerDto,
            runnerId,
            userId: new mongoose_2.Types.ObjectId(userId),
            registrationToken,
            status: runner_schema_1.RunnerStatus.OFFLINE,
            isActive: true,
        });
        return runner.save();
    }
    async registerRunner(registerRunnerDto) {
        const runner = await this.runnerModel.findOne({
            registrationToken: registerRunnerDto.registrationToken,
            isActive: true,
        });
        if (!runner) {
            throw new common_1.NotFoundException('Invalid registration token');
        }
        if (runner.status !== runner_schema_1.RunnerStatus.OFFLINE) {
            throw new common_1.BadRequestException('Runner is already registered');
        }
        runner.name = registerRunnerDto.name;
        runner.description = registerRunnerDto.description;
        runner.architecture = registerRunnerDto.architecture;
        runner.operatingSystem = registerRunnerDto.operatingSystem;
        runner.labels = registerRunnerDto.labels || [];
        runner.capabilities = registerRunnerDto.capabilities || {};
        runner.environment = registerRunnerDto.environment || {};
        runner.version = registerRunnerDto.version;
        runner.systemInfo = registerRunnerDto.systemInfo || {};
        runner.status = runner_schema_1.RunnerStatus.IDLE;
        runner.lastSeenAt = new Date();
        runner.lastHeartbeatAt = new Date();
        runner.accessToken = this.generateAccessToken();
        return runner.save();
    }
    async findAll(userId) {
        const filter = userId ? { userId: new mongoose_2.Types.ObjectId(userId) } : {};
        return this.runnerModel.find(filter).exec();
    }
    async findOne(id) {
        const runner = await this.runnerModel.findById(id).exec();
        if (!runner) {
            throw new common_1.NotFoundException('Runner not found');
        }
        return runner;
    }
    async findByRunnerId(runnerId) {
        const runner = await this.runnerModel.findOne({ runnerId }).exec();
        if (!runner) {
            throw new common_1.NotFoundException('Runner not found');
        }
        return runner;
    }
    async update(id, updateRunnerDto) {
        const runner = await this.runnerModel.findByIdAndUpdate(id, { $set: updateRunnerDto }, { new: true }).exec();
        if (!runner) {
            throw new common_1.NotFoundException('Runner not found');
        }
        return runner;
    }
    async remove(id) {
        const result = await this.runnerModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException('Runner not found');
        }
    }
    async updateStatus(runnerId, status) {
        const runner = await this.runnerModel.findOneAndUpdate({ runnerId }, {
            $set: {
                status,
                lastSeenAt: new Date(),
                lastHeartbeatAt: new Date(),
            }
        }, { new: true }).exec();
        if (!runner) {
            throw new common_1.NotFoundException('Runner not found');
        }
        return runner;
    }
    async heartbeat(runnerId, systemInfo) {
        const updateData = {
            lastHeartbeatAt: new Date(),
            lastSeenAt: new Date(),
        };
        if (systemInfo) {
            updateData.systemInfo = systemInfo;
        }
        const runner = await this.runnerModel.findOneAndUpdate({ runnerId }, { $set: updateData }, { new: true }).exec();
        if (!runner) {
            throw new common_1.NotFoundException('Runner not found');
        }
        return runner;
    }
    async assignJob(runnerId, jobData) {
        const runner = await this.runnerModel.findOneAndUpdate({
            runnerId,
            status: runner_schema_1.RunnerStatus.IDLE,
            isActive: true,
        }, {
            $set: {
                status: runner_schema_1.RunnerStatus.BUSY,
                currentJob: {
                    ...jobData,
                    startedAt: new Date(),
                },
                lastSeenAt: new Date(),
            }
        }, { new: true }).exec();
        if (!runner) {
            throw new common_1.NotFoundException('Runner not available for job assignment');
        }
        return runner;
    }
    async completeJob(runnerId, jobId, status, duration) {
        const runner = await this.runnerModel.findOne({ runnerId }).exec();
        if (!runner) {
            throw new common_1.NotFoundException('Runner not found');
        }
        if (!runner.currentJob || runner.currentJob.jobId !== jobId) {
            throw new common_1.BadRequestException('No matching job found for this runner');
        }
        const jobHistoryEntry = {
            ...runner.currentJob,
            status,
            completedAt: new Date(),
            duration,
        };
        const updateData = {
            status: runner_schema_1.RunnerStatus.IDLE,
            currentJob: null,
            lastSeenAt: new Date(),
            $push: { jobHistory: jobHistoryEntry },
            $inc: { totalJobsCompleted: 1 },
        };
        if (status === 'failed') {
            updateData.$inc.totalJobsFailed = 1;
        }
        if (duration) {
            updateData.$inc.totalRuntimeSeconds = duration;
        }
        const updatedRunner = await this.runnerModel.findByIdAndUpdate(runner._id, updateData, { new: true }).exec();
        return updatedRunner;
    }
    async getAvailableRunners(labels) {
        const filter = {
            status: runner_schema_1.RunnerStatus.IDLE,
            isActive: true,
        };
        if (labels && labels.length > 0) {
            filter.labels = { $in: labels };
        }
        return this.runnerModel.find(filter).exec();
    }
    async generateRegistrationTokenForUser(userId) {
        const token = this.generateRegistrationToken();
        const runner = new this.runnerModel({
            runnerId: this.generateRunnerId(),
            userId: new mongoose_2.Types.ObjectId(userId),
            registrationToken: token,
            status: runner_schema_1.RunnerStatus.OFFLINE,
            isActive: true,
            name: 'Pending Registration',
        });
        await runner.save();
        return token;
    }
    generateRunnerId() {
        return `runner_${(0, crypto_1.randomBytes)(8).toString('hex')}`;
    }
    generateRegistrationToken() {
        return `reg_${(0, crypto_1.randomBytes)(16).toString('hex')}`;
    }
    generateAccessToken() {
        return `token_${(0, crypto_1.randomBytes)(24).toString('hex')}`;
    }
};
exports.RunnersService = RunnersService;
exports.RunnersService = RunnersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(runner_schema_1.Runner.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RunnersService);
//# sourceMappingURL=runners.service.js.map