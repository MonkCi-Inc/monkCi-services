"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const installations_module_1 = require("./installations/installations.module");
const repositories_module_1 = require("./repositories/repositories.module");
const pipelines_module_1 = require("./pipelines/pipelines.module");
const jobs_module_1 = require("./jobs/jobs.module");
const runners_module_1 = require("./runners/runners.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/monkci'),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            installations_module_1.InstallationsModule,
            repositories_module_1.RepositoriesModule,
            pipelines_module_1.PipelinesModule,
            jobs_module_1.JobsModule,
            runners_module_1.RunnersModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map