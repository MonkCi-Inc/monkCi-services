"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RunnersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const runners_service_1 = require("./runners.service");
const runners_controller_1 = require("./runners.controller");
const runner_schema_1 = require("./schemas/runner.schema");
let RunnersModule = class RunnersModule {
};
exports.RunnersModule = RunnersModule;
exports.RunnersModule = RunnersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: runner_schema_1.Runner.name, schema: runner_schema_1.RunnerSchema }
            ])
        ],
        controllers: [runners_controller_1.RunnersController],
        providers: [runners_service_1.RunnersService],
        exports: [runners_service_1.RunnersService],
    })
], RunnersModule);
//# sourceMappingURL=runners.module.js.map