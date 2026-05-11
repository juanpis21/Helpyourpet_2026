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
exports.HistoriasClinicasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const historias_clinicas_service_1 = require("./historias-clinicas.service");
const create_historia_clinica_dto_1 = require("./dto/create-historia-clinica.dto");
const update_historia_clinica_dto_1 = require("./dto/update-historia-clinica.dto");
const create_consulta_medica_dto_1 = require("./dto/create-consulta-medica.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let HistoriasClinicasController = class HistoriasClinicasController {
    constructor(service) {
        this.service = service;
    }
    create(dto) {
        return this.service.create(dto);
    }
    findAll() {
        return this.service.findAll();
    }
    findOrCreateByMascota(mascotaId) {
        return this.service.findOrCreateByMascota(+mascotaId);
    }
    findOne(id) {
        return this.service.findOne(+id);
    }
    update(id, dto) {
        return this.service.update(+id, dto);
    }
    remove(id) {
        return this.service.remove(+id);
    }
    createConsulta(dto) {
        return this.service.createConsulta(dto);
    }
    getConsultas(historiaId) {
        return this.service.findConsultasByHistoria(+historiaId);
    }
    removeConsulta(id) {
        return this.service.removeConsulta(+id);
    }
};
exports.HistoriasClinicasController = HistoriasClinicasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva historia clínica' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_historia_clinica_dto_1.CreateHistoriaClinicaDto]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las historias clínicas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mascota/:mascotaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener o crear automáticamente la historia clínica de una mascota' }),
    __param(0, (0, common_1.Param)('mascotaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "findOrCreateByMascota", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historia clínica por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar datos fijos de la historia clínica (alergias, vacunas, etc.)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_historia_clinica_dto_1.UpdateHistoriaClinicaDto]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una historia clínica' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('consultas'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar una nueva consulta médica dentro de una historia clínica' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_consulta_medica_dto_1.CreateConsultaMedicaDto]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "createConsulta", null);
__decorate([
    (0, common_1.Get)(':historiaId/consultas'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las consultas de una historia clínica' }),
    __param(0, (0, common_1.Param)('historiaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "getConsultas", null);
__decorate([
    (0, common_1.Delete)('consultas/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una consulta médica' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "removeConsulta", null);
exports.HistoriasClinicasController = HistoriasClinicasController = __decorate([
    (0, swagger_1.ApiTags)('historias-clinicas'),
    (0, common_1.Controller)('historias-clinicas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [historias_clinicas_service_1.HistoriasClinicasService])
], HistoriasClinicasController);
//# sourceMappingURL=historias-clinicas.controller.js.map