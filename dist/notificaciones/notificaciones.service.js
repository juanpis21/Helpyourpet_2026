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
exports.NotificacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notificacion_entity_1 = require("./entities/notificacion.entity");
let NotificacionesService = class NotificacionesService {
    constructor(notificacionesRepository) {
        this.notificacionesRepository = notificacionesRepository;
    }
    async enviar(createNotificacionDto) {
        const notificacion = this.notificacionesRepository.create({
            ...createNotificacionDto,
            estado: notificacion_entity_1.EstadoNotificacion.NO_LEIDO,
        });
        return this.notificacionesRepository.save(notificacion);
    }
    async enviarAlertaRapida(usuarioId, mensaje, tipo = notificacion_entity_1.TipoNotificacion.INFO) {
        const notificacion = this.notificacionesRepository.create({
            usuarioId,
            mensaje,
            tipo,
            estado: notificacion_entity_1.EstadoNotificacion.NO_LEIDO,
        });
        return this.notificacionesRepository.save(notificacion);
    }
    async findByUsuario(usuarioId) {
        return this.notificacionesRepository.find({
            where: { usuarioId },
            order: { fecha: 'DESC' },
        });
    }
    async findNoLeidasByUsuario(usuarioId) {
        return this.notificacionesRepository.find({
            where: { usuarioId, estado: notificacion_entity_1.EstadoNotificacion.NO_LEIDO },
            order: { fecha: 'DESC' },
        });
    }
    async marcarComoLeida(id, usuarioId) {
        const notificacion = await this.notificacionesRepository.findOne({
            where: { id, usuarioId }
        });
        if (!notificacion) {
            throw new common_1.NotFoundException(`Notificación con ID ${id} no encontrada en tu cuenta`);
        }
        notificacion.estado = notificacion_entity_1.EstadoNotificacion.LEIDO;
        return this.notificacionesRepository.save(notificacion);
    }
    async marcarTodasComoLeidas(usuarioId) {
        await this.notificacionesRepository.update({ usuarioId, estado: notificacion_entity_1.EstadoNotificacion.NO_LEIDO }, { estado: notificacion_entity_1.EstadoNotificacion.LEIDO });
    }
    async findAll() {
        return this.notificacionesRepository.find({
            relations: ['usuario'],
            order: { fecha: 'DESC' }
        });
    }
};
exports.NotificacionesService = NotificacionesService;
exports.NotificacionesService = NotificacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notificacion_entity_1.Notificacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], NotificacionesService);
//# sourceMappingURL=notificaciones.service.js.map