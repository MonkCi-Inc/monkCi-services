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
exports.InstallationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const installation_schema_1 = require("./schemas/installation.schema");
let InstallationsService = class InstallationsService {
    constructor(installationModel) {
        this.installationModel = installationModel;
    }
    async create(createInstallationDto) {
        const createdInstallation = new this.installationModel(createInstallationDto);
        return createdInstallation.save();
    }
    async findAll() {
        return this.installationModel.find().populate('userId').exec();
    }
    async findOne(id) {
        return this.installationModel.findById(id).populate('userId').exec();
    }
    async findByInstallationId(installationId) {
        return this.installationModel.findOne({ installationId }).populate('userId').exec();
    }
    async findByUserId(userId) {
        return this.installationModel.find({ userId }).populate('userId').exec();
    }
    async update(id, updateInstallationDto) {
        return this.installationModel
            .findByIdAndUpdate(id, updateInstallationDto, { new: true })
            .populate('userId')
            .exec();
    }
    async updateByInstallationId(installationId, updateInstallationDto) {
        return this.installationModel
            .findOneAndUpdate({ installationId }, updateInstallationDto, { new: true })
            .populate('userId')
            .exec();
    }
    async remove(id) {
        return this.installationModel.findByIdAndDelete(id).exec();
    }
};
exports.InstallationsService = InstallationsService;
exports.InstallationsService = InstallationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(installation_schema_1.Installation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], InstallationsService);
//# sourceMappingURL=installations.service.js.map