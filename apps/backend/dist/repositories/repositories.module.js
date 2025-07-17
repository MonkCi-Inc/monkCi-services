"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositoriesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const repositories_service_1 = require("./repositories.service");
const repositories_controller_1 = require("./repositories.controller");
const repository_schema_1 = require("./schemas/repository.schema");
let RepositoriesModule = class RepositoriesModule {
};
exports.RepositoriesModule = RepositoriesModule;
exports.RepositoriesModule = RepositoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: repository_schema_1.Repository.name, schema: repository_schema_1.RepositorySchema }]),
        ],
        controllers: [repositories_controller_1.RepositoriesController],
        providers: [repositories_service_1.RepositoriesService],
        exports: [repositories_service_1.RepositoriesService],
    })
], RepositoriesModule);
//# sourceMappingURL=repositories.module.js.map