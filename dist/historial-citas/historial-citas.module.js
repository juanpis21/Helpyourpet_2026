"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorialCitasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const historial_citas_controller_1 = require("./historial-citas.controller");
const historial_citas_service_1 = require("./historial-citas.service");
const historial_cita_entity_1 = require("./entities/historial-cita.entity");
const citas_module_1 = require("../citas/citas.module");
const users_module_1 = require("../users/users.module");
let HistorialCitasModule = class HistorialCitasModule {
};
exports.HistorialCitasModule = HistorialCitasModule;
exports.HistorialCitasModule = HistorialCitasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([historial_cita_entity_1.HistorialCita]),
            (0, common_1.forwardRef)(() => citas_module_1.CitasModule),
            users_module_1.UsersModule
        ],
        controllers: [historial_citas_controller_1.HistorialCitasController],
        providers: [historial_citas_service_1.HistorialCitasService],
        exports: [historial_citas_service_1.HistorialCitasService],
    })
], HistorialCitasModule);
//# sourceMappingURL=historial-citas.module.js.map