"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmergenciasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const emergencias_controller_1 = require("./emergencias.controller");
const emergencias_service_1 = require("./emergencias.service");
const emergencia_entity_1 = require("./entities/emergencia.entity");
const pets_module_1 = require("../pets/pets.module");
const roles_module_1 = require("../roles/roles.module");
const veterinarias_module_1 = require("../veterinarias/veterinarias.module");
let EmergenciasModule = class EmergenciasModule {
};
exports.EmergenciasModule = EmergenciasModule;
exports.EmergenciasModule = EmergenciasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([emergencia_entity_1.Emergencia]), pets_module_1.PetsModule, roles_module_1.RolesModule, veterinarias_module_1.VeterinariasModule],
        controllers: [emergencias_controller_1.EmergenciasController],
        providers: [emergencias_service_1.EmergenciasService],
        exports: [emergencias_service_1.EmergenciasService],
    })
], EmergenciasModule);
//# sourceMappingURL=emergencias.module.js.map