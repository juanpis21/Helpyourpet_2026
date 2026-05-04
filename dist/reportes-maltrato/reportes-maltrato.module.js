"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportesMaltratoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reportes_maltrato_service_1 = require("./reportes-maltrato.service");
const reportes_maltrato_controller_1 = require("./reportes-maltrato.controller");
const reporte_maltrato_entity_1 = require("./entities/reporte-maltrato.entity");
const pets_module_1 = require("../pets/pets.module");
let ReportesMaltratoModule = class ReportesMaltratoModule {
};
exports.ReportesMaltratoModule = ReportesMaltratoModule;
exports.ReportesMaltratoModule = ReportesMaltratoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([reporte_maltrato_entity_1.ReporteMaltrato]),
            pets_module_1.PetsModule
        ],
        controllers: [reportes_maltrato_controller_1.ReportesMaltratoController],
        providers: [reportes_maltrato_service_1.ReportesMaltratoService],
    })
], ReportesMaltratoModule);
//# sourceMappingURL=reportes-maltrato.module.js.map