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
exports.RunnerSchema = exports.Runner = exports.RunnerOperatingSystem = exports.RunnerArchitecture = exports.RunnerStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RunnerStatus;
(function (RunnerStatus) {
    RunnerStatus["IDLE"] = "idle";
    RunnerStatus["BUSY"] = "busy";
    RunnerStatus["OFFLINE"] = "offline";
    RunnerStatus["ERROR"] = "error";
})(RunnerStatus || (exports.RunnerStatus = RunnerStatus = {}));
var RunnerArchitecture;
(function (RunnerArchitecture) {
    RunnerArchitecture["X86_64"] = "x86_64";
    RunnerArchitecture["ARM64"] = "arm64";
    RunnerArchitecture["ARM32"] = "arm32";
})(RunnerArchitecture || (exports.RunnerArchitecture = RunnerArchitecture = {}));
var RunnerOperatingSystem;
(function (RunnerOperatingSystem) {
    RunnerOperatingSystem["LINUX"] = "linux";
    RunnerOperatingSystem["WINDOWS"] = "windows";
    RunnerOperatingSystem["MACOS"] = "macos";
})(RunnerOperatingSystem || (exports.RunnerOperatingSystem = RunnerOperatingSystem = {}));
let Runner = class Runner {
};
exports.Runner = Runner;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Runner.prototype, "runnerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Runner.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'Installation', default: [] }),
    __metadata("design:type", Array)
], Runner.prototype, "installations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Runner.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Runner.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RunnerStatus, default: RunnerStatus.OFFLINE }),
    __metadata("design:type", String)
], Runner.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RunnerArchitecture }),
    __metadata("design:type", String)
], Runner.prototype, "architecture", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: RunnerOperatingSystem }),
    __metadata("design:type", String)
], Runner.prototype, "operatingSystem", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Runner.prototype, "labels", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Runner.prototype, "capabilities", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Runner.prototype, "environment", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Runner.prototype, "version", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Runner.prototype, "lastSeenAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Runner.prototype, "lastHeartbeatAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Runner.prototype, "systemInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", Object)
], Runner.prototype, "currentJob", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], Runner.prototype, "jobHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Runner.prototype, "totalJobsCompleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Runner.prototype, "totalJobsFailed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Runner.prototype, "totalRuntimeSeconds", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Runner.prototype, "registrationToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Runner.prototype, "accessToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Runner.prototype, "isActive", void 0);
exports.Runner = Runner = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Runner);
exports.RunnerSchema = mongoose_1.SchemaFactory.createForClass(Runner);
//# sourceMappingURL=runner.schema.js.map