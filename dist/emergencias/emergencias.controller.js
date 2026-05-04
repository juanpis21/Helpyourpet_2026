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
exports.EmergenciasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const emergencias_service_1 = require("./emergencias.service");
const create_emergencia_dto_1 = require("./dto/create-emergencia.dto");
const update_emergencia_dto_1 = require("./dto/update-emergencia.dto");
const emergencia_entity_1 = require("./entities/emergencia.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let EmergenciasController = class EmergenciasController {
    constructor(emergenciasService) {
        this.emergenciasService = emergenciasService;
    }
    create(createEmergenciaDto) {
        return this.emergenciasService.create(createEmergenciaDto);
    }
    findAll() {
        return this.emergenciasService.findAll();
    }
    findByMascota(mascotaId) {
        return this.emergenciasService.findByMascota(+mascotaId);
    }
    findByVeterinario(veterinarioId) {
        return this.emergenciasService.findByVeterinario(+veterinarioId);
    }
    findByVeterinaria(veterinariaId) {
        return this.emergenciasService.findByVeterinaria(+veterinariaId);
    }
    findByTipo(tipo) {
        return this.emergenciasService.findByTipo(tipo);
    }
    findByFecha(fecha) {
        return this.emergenciasService.findByFecha(fecha);
    }
    findOne(id) {
        return this.emergenciasService.findOne(+id);
    }
    update(id, updateEmergenciaDto) {
        return this.emergenciasService.update(+id, updateEmergenciaDto);
    }
    remove(id) {
        return this.emergenciasService.remove(+id);
    }
};
exports.EmergenciasController = EmergenciasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva emergencia' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Emergencia creada exitosamente', type: emergencia_entity_1.Emergencia }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mascota, veterinario o veterinaria no encontrada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_emergencia_dto_1.CreateEmergenciaDto]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las emergencias' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de emergencias', type: [emergencia_entity_1.Emergencia] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mascota/:mascotaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener emergencias por mascota' }),
    (0, swagger_1.ApiParam)({ name: 'mascotaId', description: 'ID de la mascota' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de emergencias de la mascota', type: [emergencia_entity_1.Emergencia] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mascota no encontrada' }),
    __param(0, (0, common_1.Param)('mascotaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "findByMascota", null);
__decorate([
    (0, common_1.Get)('veterinario/:veterinarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener emergencias por veterinario' }),
    (0, swagger_1.ApiParam)({ name: 'veterinarioId', description: 'ID del veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de emergencias del veterinario', type: [emergencia_entity_1.Emergencia] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Veterinario no encontrado' }),
    __param(0, (0, common_1.Param)('veterinarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "findByVeterinario", null);
__decorate([
    (0, common_1.Get)('veterinaria/:veterinariaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener emergencias por veterinaria' }),
    (0, swagger_1.ApiParam)({ name: 'veterinariaId', description: 'ID de la veterinaria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de emergencias de la veterinaria', type: [emergencia_entity_1.Emergencia] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Veterinaria no encontrada' }),
    __param(0, (0, common_1.Param)('veterinariaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "findByVeterinaria", null);
__decorate([
    (0, common_1.Get)('tipo/:tipo'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener emergencias por tipo' }),
    (0, swagger_1.ApiParam)({ name: 'tipo', description: 'Tipo de emergencia' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de emergencias por tipo', type: [emergencia_entity_1.Emergencia] }),
    __param(0, (0, common_1.Param)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)('fecha/:fecha'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener emergencias por fecha' }),
    (0, swagger_1.ApiParam)({ name: 'fecha', description: 'Fecha (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de emergencias por fecha', type: [emergencia_entity_1.Emergencia] }),
    __param(0, (0, common_1.Param)('fecha')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "findByFecha", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una emergencia por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la emergencia' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergencia encontrada', type: emergencia_entity_1.Emergencia }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergencia no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una emergencia' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la emergencia' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Emergencia actualizada', type: emergencia_entity_1.Emergencia }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergencia, mascota, veterinario o veterinaria no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_emergencia_dto_1.UpdateEmergenciaDto]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una emergencia' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la emergencia' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Emergencia eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Emergencia no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmergenciasController.prototype, "remove", null);
exports.EmergenciasController = EmergenciasController = __decorate([
    (0, swagger_1.ApiTags)('emergencias'),
    (0, common_1.Controller)('emergencias'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [emergencias_service_1.EmergenciasService])
], EmergenciasController);
//# sourceMappingURL=emergencias.controller.js.map