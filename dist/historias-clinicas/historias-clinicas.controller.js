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
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let HistoriasClinicasController = class HistoriasClinicasController {
    constructor(historiasClinicasService) {
        this.historiasClinicasService = historiasClinicasService;
    }
    create(createDto) {
        return this.historiasClinicasService.create(createDto);
    }
    findAll() {
        return this.historiasClinicasService.findAll();
    }
    findByMascota(mascotaId) {
        return this.historiasClinicasService.findByMascota(+mascotaId);
    }
    findOne(id) {
        return this.historiasClinicasService.findOne(+id);
    }
    update(id, updateDto) {
        return this.historiasClinicasService.update(+id, updateDto);
    }
    remove(id) {
        return this.historiasClinicasService.remove(+id);
    }
};
exports.HistoriasClinicasController = HistoriasClinicasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Aperturar el expediente vital de un paciente por primera vez' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_historia_clinica_dto_1.CreateHistoriaClinicaDto]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ver el archivero maestro de todas las historias clínicas del servidor' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('mascota/:mascotaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar directamente el expediente de un paciente usando su ID de Mascota' }),
    __param(0, (0, common_1.Param)('mascotaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "findByMascota", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver detalles del fólder buscando físicamente por el ID del expediente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Añadir nueva observación clínica o reemplazar el texto del expediente' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_historia_clinica_dto_1.UpdateHistoriaClinicaDto]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Destruir legal y definitivamente un expediente' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HistoriasClinicasController.prototype, "remove", null);
exports.HistoriasClinicasController = HistoriasClinicasController = __decorate([
    (0, swagger_1.ApiTags)('historias-clinicas'),
    (0, common_1.Controller)('historias-clinicas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [historias_clinicas_service_1.HistoriasClinicasService])
], HistoriasClinicasController);
//# sourceMappingURL=historias-clinicas.controller.js.map