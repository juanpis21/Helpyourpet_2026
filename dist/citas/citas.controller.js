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
exports.CitasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const citas_service_1 = require("./citas.service");
const create_cita_dto_1 = require("./dto/create-cita.dto");
const update_cita_dto_1 = require("./dto/update-cita.dto");
const cita_entity_1 = require("./entities/cita.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CitasController = class CitasController {
    constructor(citasService) {
        this.citasService = citasService;
    }
    create(createCitaDto) {
        return this.citasService.create(createCitaDto);
    }
    findAll() {
        return this.citasService.findAll();
    }
    findByUsuario(usuarioId) {
        return this.citasService.findByUsuario(+usuarioId);
    }
    findByMascota(mascotaId) {
        return this.citasService.findByMascota(+mascotaId);
    }
    findByEstado(estado) {
        return this.citasService.findByEstado(estado);
    }
    findByFecha(fecha) {
        return this.citasService.findByFecha(fecha);
    }
    findOne(id) {
        return this.citasService.findOne(+id);
    }
    update(id, updateCitaDto) {
        return this.citasService.update(+id, updateCitaDto);
    }
    remove(id) {
        return this.citasService.remove(+id);
    }
};
exports.CitasController = CitasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva cita' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cita creada exitosamente', type: cita_entity_1.Cita }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario o mascota no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto: la mascota no pertenece al usuario o ya existe cita en ese horario' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cita_dto_1.CreateCitaDto]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las citas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de citas', type: [cita_entity_1.Cita] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('usuario/:usuarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener citas por usuario' }),
    (0, swagger_1.ApiParam)({ name: 'usuarioId', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de citas del usuario', type: [cita_entity_1.Cita] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)('mascota/:mascotaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener citas por mascota' }),
    (0, swagger_1.ApiParam)({ name: 'mascotaId', description: 'ID de la mascota' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de citas de la mascota', type: [cita_entity_1.Cita] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mascota no encontrada' }),
    __param(0, (0, common_1.Param)('mascotaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findByMascota", null);
__decorate([
    (0, common_1.Get)('estado/:estado'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener citas por estado' }),
    (0, swagger_1.ApiParam)({ name: 'estado', description: 'Estado de la cita (Programada, En curso, Completada, Cancelada)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de citas por estado', type: [cita_entity_1.Cita] }),
    __param(0, (0, common_1.Param)('estado')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findByEstado", null);
__decorate([
    (0, common_1.Get)('fecha/:fecha'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener citas por fecha' }),
    (0, swagger_1.ApiParam)({ name: 'fecha', description: 'Fecha en formato YYYY-MM-DD' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de citas de la fecha', type: [cita_entity_1.Cita] }),
    __param(0, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findByFecha", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una cita por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la cita' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cita encontrada', type: cita_entity_1.Cita }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cita no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una cita' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la cita' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cita actualizada', type: cita_entity_1.Cita }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cita, usuario o mascota no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Conflicto: la mascota no pertenece al usuario o la fecha no es futura' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_cita_dto_1.UpdateCitaDto]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una cita' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la cita' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Cita eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cita no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CitasController.prototype, "remove", null);
exports.CitasController = CitasController = __decorate([
    (0, swagger_1.ApiTags)('citas'),
    (0, common_1.Controller)('citas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [citas_service_1.CitasService])
], CitasController);
//# sourceMappingURL=citas.controller.js.map