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
exports.Cita = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const pet_entity_1 = require("../../pets/entities/pet.entity");
const historial_cita_entity_1 = require("../../historial-citas/entities/historial-cita.entity");
let Cita = class Cita {
};
exports.Cita = Cita;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la cita',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cita.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Motivo de la cita',
        example: 'Control general y vacunación'
    }),
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], Cita.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora de la cita',
        example: '2026-03-20T10:30:00.000Z'
    }),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Cita.prototype, "fechaHora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la cita',
        example: 'Programada',
        enum: ['Programada', 'En curso', 'Completada', 'Cancelada']
    }),
    (0, typeorm_1.Column)({
        length: 20,
        default: 'Programada',
        enum: ['Programada', 'En curso', 'Completada', 'Cancelada']
    }),
    __metadata("design:type", String)
], Cita.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionales de la cita',
        example: 'El paciente es nervioso, se necesita manejo especial',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Cita.prototype, "notas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario que solicita la cita',
        type: () => user_entity_1.User
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.citas),
    __metadata("design:type", user_entity_1.User)
], Cita.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Veterinario asignado a la cita',
        type: () => user_entity_1.User,
        required: false
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.citasAsignadas),
    __metadata("design:type", user_entity_1.User)
], Cita.prototype, "veterinario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mascota del paciente',
        type: () => pet_entity_1.Pet
    }),
    (0, typeorm_1.ManyToOne)(() => pet_entity_1.Pet, pet => pet.citas),
    __metadata("design:type", pet_entity_1.Pet)
], Cita.prototype, "mascota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Historial de cambios de esta cita',
        type: () => [historial_cita_entity_1.HistorialCita]
    }),
    (0, typeorm_1.OneToMany)(() => historial_cita_entity_1.HistorialCita, historialCita => historialCita.cita),
    __metadata("design:type", Array)
], Cita.prototype, "historial", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la cita está activa en el sistema',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Cita.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cita.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Cita.prototype, "updatedAt", void 0);
exports.Cita = Cita = __decorate([
    (0, typeorm_1.Entity)('citas')
], Cita);
//# sourceMappingURL=cita.entity.js.map