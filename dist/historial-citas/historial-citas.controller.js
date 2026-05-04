"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistorialCitasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const historial_citas_service_1 = require("./historial-citas.service");
const historial_cita_entity_1 = require("./entities/historial-cita.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let HistorialCitasController = class HistorialCitasController {
    constructor(historialCitasService) {
        this.historialCitasService = historialCitasService;
    }
    findAll() {
        return this.historialCitasService.findAll();
    }
    findByCita(citaId) {
        return this.historialCitasService.findByCita(+citaId);
    }
    findByUsuario(usuarioId) {
        return this.historialCitasService.findByUsuario(+usuarioId);
    }
    findByTipo(tipoCambio) {
        return this.historialCitasService.findByTipoCambio(tipoCambio);
    }
    findByFechaRange(fechaInicio, fechaFin) {
        return this.historialCitasService.findByFechaRange(fechaInicio, fechaFin);
    }
    findOne(id) {
        return this.historialCitasService.findOne(+id);
    }
};
exports.HistorialCitasController = HistorialCitasController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los registros del historial de citas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de registros del historial', type: [historial_cita_entity_1.HistorialCita] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HistorialCitasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('cita/:citaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial por cita' }),
    (0, swagger_1.ApiParam)({ name: 'citaId', description: 'ID de la cita' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial de la cita', type: [historial_cita_entity_1.HistorialCita] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cita no encontrada' }),
    __param(0, (0, common_1.Param)('citaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialCitasController.prototype, "findByCita", null);
__decorate([
    (0, common_1.Get)('usuario/:usuarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial por usuario' }),
    (0, swagger_1.ApiParam)({ name: 'usuarioId', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial del usuario', type: [historial_cita_entity_1.HistorialCita] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialCitasController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)('tipo/:tipoCambio'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial por tipo de cambio' }),
    (0, swagger_1.ApiParam)({ name: 'tipoCambio', description: 'Tipo de cambio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial por tipo de cambio', type: [historial_cita_entity_1.HistorialCita] }),
    __param(0, (0, common_1.Param)('tipoCambio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialCitasController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)('fecha'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial por rango de fechas', type: [historial_cita_entity_1.HistorialCita] }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], HistorialCitasController.prototype, "findByFechaRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un registro del historial por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del registro del historial' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Registro del historial encontrado', type: historial_cita_entity_1.HistorialCita }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Registro del historial no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistorialCitasController.prototype, "findOne", null);
exports.HistorialCitasController = HistorialCitasController = __decorate([
    (0, swagger_1.ApiTags)('historial-citas'),
    (0, common_1.Controller)('historial-citas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [historial_citas_service_1.HistorialCitasService])
], HistorialCitasController);
//# sourceMappingURL=historial-citas.controller.js.map