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
exports.ReportesMaltratoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reportes_maltrato_service_1 = require("./reportes-maltrato.service");
const create_reporte_maltrato_dto_1 = require("./dto/create-reporte-maltrato.dto");
const update_reporte_maltrato_dto_1 = require("./dto/update-reporte-maltrato.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ReportesMaltratoController = class ReportesMaltratoController {
    constructor(reportesService) {
        this.reportesService = reportesService;
    }
    create(req, createDto) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return this.reportesService.create(createDto, usuarioId);
    }
    findMisReportes(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return this.reportesService.findByUsuario(usuarioId);
    }
    findAll() {
        return this.reportesService.findAll();
    }
    findOne(id) {
        return this.reportesService.findOne(+id);
    }
    updateEstado(id, updateDto) {
        return this.reportesService.updateEstado(+id, updateDto);
    }
    remove(id) {
        return this.reportesService.remove(+id);
    }
};
exports.ReportesMaltratoController = ReportesMaltratoController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar una denuncia de maltrato animal (Obligatorio Login)' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_reporte_maltrato_dto_1.CreateReporteMaltratoDto]),
    __metadata("design:returntype", void 0)
], ReportesMaltratoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mis-reportes'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el seguimiento de mis denuncias previas enviadas' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReportesMaltratoController.prototype, "findMisReportes", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Bandeja de entrada: Leer todos los reportes de maltrato enviados a la clínica (Admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportesMaltratoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Ver en profundidad un reporte de maltrato por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportesMaltratoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    (0, swagger_1.ApiOperation)({ summary: 'Modificar el avance/estado del reporte (ej: De Pendiente a Resuelto)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_reporte_maltrato_dto_1.UpdateReporteMaltratoDto]),
    __metadata("design:returntype", void 0)
], ReportesMaltratoController.prototype, "updateEstado", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar el reporte de maltrato definitivamente (Admin)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ReportesMaltratoController.prototype, "remove", null);
exports.ReportesMaltratoController = ReportesMaltratoController = __decorate([
    (0, swagger_1.ApiTags)('reportes-maltrato'),
    (0, common_1.Controller)('reportes-maltrato'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [reportes_maltrato_service_1.ReportesMaltratoService])
], ReportesMaltratoController);
//# sourceMappingURL=reportes-maltrato.controller.js.map