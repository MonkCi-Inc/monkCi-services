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
exports.InstallationSchema = exports.Installation = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Installation = class Installation {
};
exports.Installation = Installation;
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", Number)
], Installation.prototype, "installationId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Installation.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Installation.prototype, "accountLogin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['User', 'Organization'] }),
    __metadata("design:type", String)
], Installation.prototype, "accountType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], Installation.prototype, "permissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ['all', 'selected'] }),
    __metadata("design:type", String)
], Installation.prototype, "repositorySelection", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Installation.prototype, "suspendedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Installation.prototype, "suspendedBy", void 0);
exports.Installation = Installation = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Installation);
exports.InstallationSchema = mongoose_1.SchemaFactory.createForClass(Installation);
//# sourceMappingURL=installation.schema.js.map