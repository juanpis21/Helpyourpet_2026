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
exports.CalificacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const calificaciones_service_1 = require("./calificaciones.service");
const create_calificacion_dto_1 = require("./dto/create-calificacion.dto");
const update_calificacion_dto_1 = require("./dto/update-calificacion.dto");
const calificacion_entity_1 = require("./entities/calificacion.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CalificacionesController = class CalificacionesController {
    constructor(calificacionesService) {
        this.calificacionesService = calificacionesService;
    }
    create(createCalificacionDto, req) {
        const usuarioId = createCalificacionDto.usuarioId || req.user?.userId || req.user?.id;
        return this.calificacionesService.create(usuarioId, createCalificacionDto);
    }
    findAll() {
        return this.calificacionesService.findAll();
    }
    findOne(id) {
        return this.calificacionesService.findOne(+id);
    }
    findByServicio(servicioId) {
        return this.calificacionesService.findByServicio(+servicioId);
    }
    findByUsuario(usuarioId) {
        return this.calificacionesService.findByUsuario(+usuarioId);
    }
    findByVeterinario(veterinarioId) {
        return this.calificacionesService.findByVeterinario(+veterinarioId);
    }
    findMisCalificaciones(req) {
        return this.calificacionesService.findByUsuario(req.user.id);
    }
    getCalificacionesPendientes() {
        return this.calificacionesService.getCalificacionesPendientes();
    }
    update(id, updateCalificacionDto) {
        return this.calificacionesService.update(+id, updateCalificacionDto);
    }
    remove(id) {
        return this.calificacionesService.remove(+id);
    }
    getEstadisticasPorServicio(servicioId) {
        return this.calificacionesService.getEstadisticasPorServicio(+servicioId);
    }
    getEstadisticasPorVeterinario(veterinarioId) {
        return this.calificacionesService.getEstadisticasPorVeterinario(+veterinarioId);
    }
};
exports.CalificacionesController = CalificacionesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva calificación' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Calificación creada exitosamente', type: calificacion_entity_1.Calificacion }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_calificacion_dto_1.CreateCalificacionDto, Object]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las calificaciones aprobadas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de calificaciones', type: [calificacion_entity_1.Calificacion] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una calificación por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la calificación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calificación encontrada', type: calificacion_entity_1.Calificacion }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Calificación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('servicio/:servicioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener calificaciones por servicio' }),
    (0, swagger_1.ApiParam)({ name: 'servicioId', description: 'ID del servicio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calificaciones del servicio', type: [calificacion_entity_1.Calificacion] }),
    __param(0, (0, common_1.Param)('servicioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findByServicio", null);
__decorate([
    (0, common_1.Get)('usuario/:usuarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener calificaciones por usuario' }),
    (0, swagger_1.ApiParam)({ name: 'usuarioId', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calificaciones del usuario', type: [calificacion_entity_1.Calificacion] }),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)('veterinario/:veterinarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener calificaciones por veterinario' }),
    (0, swagger_1.ApiParam)({ name: 'veterinarioId', description: 'ID del veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calificaciones del veterinario', type: [calificacion_entity_1.Calificacion] }),
    __param(0, (0, common_1.Param)('veterinarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findByVeterinario", null);
__decorate([
    (0, common_1.Get)('mis-calificaciones'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener mis calificaciones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mis calificaciones', type: [calificacion_entity_1.Calificacion] }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "findMisCalificaciones", null);
__decorate([
    (0, common_1.Get)('pendientes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener calificaciones pendientes de aprobación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calificaciones pendientes', type: [calificacion_entity_1.Calificacion] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "getCalificacionesPendientes", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una calificación' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la calificación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calificación actualizada', type: calificacion_entity_1.Calificacion }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Calificación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_calificacion_dto_1.UpdateCalificacionDto]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una calificación' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la calificación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Calificación eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Calificación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('estadisticas/servicio/:servicioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de un servicio' }),
    (0, swagger_1.ApiParam)({ name: 'servicioId', description: 'ID del servicio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas del servicio' }),
    __param(0, (0, common_1.Param)('servicioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "getEstadisticasPorServicio", null);
__decorate([
    (0, common_1.Get)('estadisticas/veterinario/:veterinarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de un veterinario' }),
    (0, swagger_1.ApiParam)({ name: 'veterinarioId', description: 'ID del veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas del veterinario' }),
    __param(0, (0, common_1.Param)('veterinarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CalificacionesController.prototype, "getEstadisticasPorVeterinario", null);
exports.CalificacionesController = CalificacionesController = __decorate([
    (0, swagger_1.ApiTags)('calificaciones'),
    (0, common_1.Controller)('calificaciones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [calificaciones_service_1.CalificacionesService])
], CalificacionesController);
//# sourceMappingURL=calificaciones.controller.js.map