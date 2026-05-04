"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilesVeterinariosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const perfiles_veterinarios_controller_1 = require("./perfiles-veterinarios.controller");
const perfiles_veterinarios_service_1 = require("./perfiles-veterinarios.service");
const perfil_veterinario_entity_1 = require("./entities/perfil-veterinario.entity");
const users_module_1 = require("../users/users.module");
const veterinarias_module_1 = require("../veterinarias/veterinarias.module");
let PerfilesVeterinariosModule = class PerfilesVeterinariosModule {
};
exports.PerfilesVeterinariosModule = PerfilesVeterinariosModule;
exports.PerfilesVeterinariosModule = PerfilesVeterinariosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([perfil_veterinario_entity_1.PerfilVeterinario]), users_module_1.UsersModule, veterinarias_module_1.VeterinariasModule],
        controllers: [perfiles_veterinarios_controller_1.PerfilesVeterinariosController],
        providers: [perfiles_veterinarios_service_1.PerfilesVeterinariosService],
        exports: [perfiles_veterinarios_service_1.PerfilesVeterinariosService],
    })
], PerfilesVeterinariosModule);
//# sourceMappingURL=perfiles-veterinarios.module.js.map