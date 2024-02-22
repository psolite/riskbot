"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmModule = void 0;
const common_1 = require("@nestjs/common");
const farm_service_1 = require("./farm.service");
const auth_module_1 = require("../auth/auth.module");
const typeorm_1 = require("@nestjs/typeorm");
const wallet_entity_1 = require("../auth/entities/wallet.entity");
let FarmModule = class FarmModule {
};
exports.FarmModule = FarmModule;
exports.FarmModule = FarmModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([wallet_entity_1.Wallet]), auth_module_1.AuthModule],
        providers: [farm_service_1.FarmService],
        exports: [farm_service_1.FarmService]
    })
], FarmModule);
//# sourceMappingURL=farm.module.js.map