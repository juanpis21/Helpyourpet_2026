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
exports.HistorialCita = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const cita_entity_1 = require("../../citas/entities/cita.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let HistorialCita = class HistorialCita {
};
exports.HistorialCita = HistorialCita;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del registro de historial',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistorialCita.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cita asociada a este registro de historial',
        type: () => cita_entity_1.Cita
    }),
    (0, typeorm_1.ManyToOne)(() => cita_entity_1.Cita, cita => cita.historial),
    __metadata("design:type", cita_entity_1.Cita)
], HistorialCita.prototype, "cita", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de cambio realizado',
        example: 'CREACION',
        enum: ['CREACION', 'ACTUALIZACION', 'CANCELACION', 'COMPLETACION']
    }),
    (0, typeorm_1.Column)({
        length: 20,
        enum: ['CREACION', 'ACTUALIZACION', 'CANCELACION', 'COMPLETACION']
    }),
    __metadata("design:type", String)
], HistorialCita.prototype, "tipoCambio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del cambio realizado',
        example: 'Se creó la cita para control general'
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], HistorialCita.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor anterior del campo cambiado',
        required: false,
        example: 'Programada'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistorialCita.prototype, "valorAnterior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo valor del campo cambiado',
        required: false,
        example: 'Cancelada'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistorialCita.prototype, "valorNuevo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario que realizó el cambio',
        type: () => user_entity_1.User
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.historialCitas),
    __metadata("design:type", user_entity_1.User)
], HistorialCita.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora del registro del historial',
        example: '2026-03-20T10:30:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HistorialCita.prototype, "fechaRegistro", void 0);
exports.HistorialCita = HistorialCita = __decorate([
    (0, typeorm_1.Entity)('historial_citas')
], HistorialCita);
//# sourceMappingURL=historial-cita.entity.js.map