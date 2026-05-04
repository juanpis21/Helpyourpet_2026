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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notificacion = exports.TipoNotificacion = exports.EstadoNotificacion = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var EstadoNotificacion;
(function (EstadoNotificacion) {
    EstadoNotificacion["LEIDO"] = "LEIDO";
    EstadoNotificacion["NO_LEIDO"] = "NO_LEIDO";
})(EstadoNotificacion || (exports.EstadoNotificacion = EstadoNotificacion = {}));
var TipoNotificacion;
(function (TipoNotificacion) {
    TipoNotificacion["INFO"] = "INFO";
    TipoNotificacion["ALERTA"] = "ALERTA";
    TipoNotificacion["EXITO"] = "EXITO";
    TipoNotificacion["ERROR"] = "ERROR";
})(TipoNotificacion || (exports.TipoNotificacion = TipoNotificacion = {}));
let Notificacion = class Notificacion {
};
exports.Notificacion = Notificacion;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único de la notificación', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notificacion.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mensaje descriptivo', example: 'Tu compra ha sido procesada con éxito.' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notificacion.prototype, "mensaje", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Tipo o severidad de la alerta', enum: TipoNotificacion }),
    (0, typeorm_1.Column)({ type: 'enum', enum: TipoNotificacion, default: TipoNotificacion.INFO }),
    __metadata("design:type", String)
], Notificacion.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado de lectura', enum: EstadoNotificacion }),
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoNotificacion, default: EstadoNotificacion.NO_LEIDO }),
    __metadata("design:type", String)
], Notificacion.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del usuario dueño de la notificación' }),
    (0, typeorm_1.Column)({ name: 'usuarioId' }),
    __metadata("design:type", Number)
], Notificacion.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", user_entity_1.User)
], Notificacion.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notificacion.prototype, "fecha", void 0);
exports.Notificacion = Notificacion = __decorate([
    (0, typeorm_1.Entity)('notificaciones')
], Notificacion);
//# sourceMappingURL=notificacion.entity.js.map