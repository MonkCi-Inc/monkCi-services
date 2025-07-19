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
exports.RepositoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const repository_schema_1 = require("./schemas/repository.schema");
let RepositoriesService = class RepositoriesService {
    constructor(repositoryModel) {
        this.repositoryModel = repositoryModel;
    }
    async create(createRepositoryDto) {
        const createdRepository = new this.repositoryModel({
            ...createRepositoryDto,
            lastSyncAt: new Date(),
        });
        return createdRepository.save();
    }
    async findAll() {
        return this.repositoryModel.find().populate('installationId').exec();
    }
    async findOne(id) {
        return this.repositoryModel.findById(id).populate('installationId').exec();
    }
    async findByRepositoryId(repositoryId) {
        return this.repositoryModel.findOne({ repositoryId }).populate('installationId').exec();
    }
    async findByInstallationId(installationId) {
        return this.repositoryModel.find({ installationId }).populate('installationId').exec();
    }
    async update(id, updateRepositoryDto) {
        return this.repositoryModel
            .findByIdAndUpdate(id, { ...updateRepositoryDto, lastSyncAt: new Date() }, { new: true })
            .populate('installationId')
            .exec();
    }
    async updateByRepositoryId(repositoryId, updateRepositoryDto) {
        return this.repositoryModel
            .findOneAndUpdate({ repositoryId }, { ...updateRepositoryDto, lastSyncAt: new Date() }, { new: true })
            .populate('installationId')
            .exec();
    }
    async upsertRepository(repositoryData) {
        try {
            console.log(`Repositories Service - Upserting repository: ${repositoryData.fullName} (ID: ${repositoryData.repositoryId})`);
            const existingRepo = await this.findByRepositoryId(repositoryData.repositoryId);
            if (existingRepo) {
                console.log(`Repositories Service - Updating existing repository: ${repositoryData.fullName}`);
                const updatedRepo = await this.updateByRepositoryId(repositoryData.repositoryId, repositoryData);
                console.log(`Repositories Service - Successfully updated repository: ${repositoryData.fullName}`);
                return updatedRepo;
            }
            else {
                console.log(`Repositories Service - Creating new repository: ${repositoryData.fullName}`);
                const newRepo = await this.create(repositoryData);
                console.log(`Repositories Service - Successfully created repository: ${repositoryData.fullName}`);
                return newRepo;
            }
        }
        catch (error) {
            console.error(`Repositories Service - Error upserting repository ${repositoryData.fullName}:`, error);
            throw error;
        }
    }
    async remove(id) {
        return this.repositoryModel.findByIdAndDelete(id).exec();
    }
    async removeByInstallationId(installationId) {
        await this.repositoryModel.deleteMany({ installationId }).exec();
    }
    async getRepositoryCount() {
        return this.repositoryModel.countDocuments().exec();
    }
    async syncRepositoriesForInstallation(installationId) {
        const repositories = await this.findByInstallationId(installationId);
        return {
            message: 'Repository sync completed',
            installationId,
            repositoriesCount: repositories.length,
            repositories
        };
    }
    async getInstallation(installationId) {
        return {
            installationId: parseInt(installationId),
        };
    }
    async syncAllRepositoriesForUser(userId) {
        const repositories = await this.repositoryModel.find().populate({
            path: 'installationId',
            match: { userId: userId }
        }).exec();
        const userRepositories = repositories.filter(repo => repo.installationId);
        return {
            message: 'All repositories sync completed',
            userId,
            repositoriesCount: userRepositories.length,
            repositories: userRepositories
        };
    }
};
exports.RepositoriesService = RepositoriesService;
exports.RepositoriesService = RepositoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(repository_schema_1.Repository.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RepositoriesService);
//# sourceMappingURL=repositories.service.js.map