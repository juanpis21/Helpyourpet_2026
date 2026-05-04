"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoriasClinicasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const historias_clinicas_service_1 = require("./historias-clinicas.service");
const historias_clinicas_controller_1 = require("./historias-clinicas.controller");
const historia_clinica_entity_1 = require("./entities/historia-clinica.entity");
const pets_module_1 = require("../pets/pets.module");
const roles_module_1 = require("../roles/roles.module");
const veterinarias_module_1 = require("../veterinarias/veterinarias.module");
const users_module_1 = require("../users/users.module");
let HistoriasClinicasModule = class HistoriasClinicasModule {
};
exports.HistoriasClinicasModule = HistoriasClinicasModule;
exports.HistoriasClinicasModule = HistoriasClinicasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([historia_clinica_entity_1.HistoriaClinica]),
            pets_module_1.PetsModule,
            roles_module_1.RolesModule,
            veterinarias_module_1.VeterinariasModule,
            users_module_1.UsersModule
        ],
        controllers: [historias_clinicas_controller_1.HistoriasClinicasController],
        providers: [historias_clinicas_service_1.HistoriasClinicasService],
        exports: [historias_clinicas_service_1.HistoriasClinicasService]
    })
], HistoriasClinicasModule);
//# sourceMappingURL=historias-clinicas.module.js.map