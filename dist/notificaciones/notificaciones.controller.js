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
exports.NotificacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notificaciones_service_1 = require("./notificaciones.service");
const create_notificacion_dto_1 = require("./dto/create-notificacion.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let NotificacionesController = class NotificacionesController {
    constructor(notificacionesService) {
        this.notificacionesService = notificacionesService;
    }
    async getMisNotificaciones(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return this.notificacionesService.findByUsuario(usuarioId);
    }
    async getNoLeidas(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return this.notificacionesService.findNoLeidasByUsuario(usuarioId);
    }
    async marcarTodasLeidas(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        await this.notificacionesService.marcarTodasComoLeidas(usuarioId);
        return { statusCode: 200, message: 'Todas las notificaciones han sido marcadas como leídas' };
    }
    async marcarComoLeida(req, id) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return this.notificacionesService.marcarComoLeida(+id, usuarioId);
    }
    async create(createNotificacionDto) {
        return this.notificacionesService.enviar(createNotificacionDto);
    }
    async findAll() {
        return this.notificacionesService.findAll();
    }
};
exports.NotificacionesController = NotificacionesController;
__decorate([
    (0, common_1.Get)('mis-notificaciones'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas mis notificaciones' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "getMisNotificaciones", null);
__decorate([
    (0, common_1.Get)('no-leidas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener solo mis notificaciones no leidas' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "getNoLeidas", null);
__decorate([
    (0, common_1.Patch)('marcar-todas-leidas'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar todo mi inbox como leído' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "marcarTodasLeidas", null);
__decorate([
    (0, common_1.Patch)(':id/leer'),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar una notificación específica como leída' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "marcarComoLeida", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Disparar una nueva notificación manualmente (Admin)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_notificacion_dto_1.CreateNotificacionDto]),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el registro global de notificaciones del sistema (Admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NotificacionesController.prototype, "findAll", null);
exports.NotificacionesController = NotificacionesController = __decorate([
    (0, swagger_1.ApiTags)('notificaciones'),
    (0, common_1.Controller)('notificaciones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [notificaciones_service_1.NotificacionesService])
], NotificacionesController);
//# sourceMappingURL=notificaciones.controller.js.map