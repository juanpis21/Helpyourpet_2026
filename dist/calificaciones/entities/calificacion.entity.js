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
exports.Calificacion = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
let Calificacion = class Calificacion {
};
exports.Calificacion = Calificacion;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la calificación',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Calificacion.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Puntuación del servicio (1-5)',
        example: 5
    }),
    (0, typeorm_1.Column)({ name: 'puntuacion', type: 'int' }),
    __metadata("design:type", Number)
], Calificacion.prototype, "puntuacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comentario de la calificación',
        example: 'Excelente servicio, muy profesional el veterinario'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Calificacion.prototype, "comentario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la calificación',
        example: 'APROBADA',
        enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA']
    }),
    (0, typeorm_1.Column)({
        length: 20,
        enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA'],
        default: 'APROBADA'
    }),
    __metadata("design:type", String)
], Calificacion.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que califica',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'usuario_id' }),
    __metadata("design:type", Number)
], Calificacion.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario que realiza la calificación',
        type: () => user_entity_1.User
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuario_id' }),
    __metadata("design:type", user_entity_1.User)
], Calificacion.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del servicio calificado',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'servicio_id' }),
    __metadata("design:type", Number)
], Calificacion.prototype, "servicioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Servicio calificado',
        type: () => servicio_entity_1.Servicio
    }),
    (0, typeorm_1.ManyToOne)(() => servicio_entity_1.Servicio),
    (0, typeorm_1.JoinColumn)({ name: 'servicio_id' }),
    __metadata("design:type", servicio_entity_1.Servicio)
], Calificacion.prototype, "servicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del veterinario atendido (opcional)',
        example: 2,
        required: false
    }),
    (0, typeorm_1.Column)({ name: 'veterinario_id', nullable: true }),
    __metadata("design:type", Number)
], Calificacion.prototype, "veterinarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Veterinario que fue atendido',
        type: () => user_entity_1.User,
        required: false
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'veterinario_id' }),
    __metadata("design:type", user_entity_1.User)
], Calificacion.prototype, "veterinario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación de la calificación', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha' }),
    __metadata("design:type", Date)
], Calificacion.prototype, "fecha", void 0);
exports.Calificacion = Calificacion = __decorate([
    (0, typeorm_1.Entity)('calificaciones')
], Calificacion);
//# sourceMappingURL=calificacion.entity.js.map