"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const citas_controller_1 = require("./citas.controller");
const citas_service_1 = require("./citas.service");
const cita_entity_1 = require("./entities/cita.entity");
const users_module_1 = require("../users/users.module");
const pets_module_1 = require("../pets/pets.module");
const roles_module_1 = require("../roles/roles.module");
const historial_citas_module_1 = require("../historial-citas/historial-citas.module");
let CitasModule = class CitasModule {
};
exports.CitasModule = CitasModule;
exports.CitasModule = CitasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([cita_entity_1.Cita]), users_module_1.UsersModule, pets_module_1.PetsModule, roles_module_1.RolesModule, (0, common_1.forwardRef)(() => historial_citas_module_1.HistorialCitasModule)],
        controllers: [citas_controller_1.CitasController],
        providers: [citas_service_1.CitasService],
        exports: [citas_service_1.CitasService],
    })
], CitasModule);
//# sourceMappingURL=citas.module.js.map