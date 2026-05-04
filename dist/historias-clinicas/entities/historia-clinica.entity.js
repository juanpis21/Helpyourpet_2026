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
exports.HistoriaClinica = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const pet_entity_1 = require("../../pets/entities/pet.entity");
const role_entity_1 = require("../../roles/entities/role.entity");
const veterinaria_entity_1 = require("../../veterinarias/entities/veterinaria.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let HistoriaClinica = class HistoriaClinica {
};
exports.HistoriaClinica = HistoriaClinica;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la Historia Clínica', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HistoriaClinica.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Diagnóstico general médico', example: 'Paciente sano, controles al día.' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistoriaClinica.prototype, "diagnostico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Historial de tratamientos activos o pasados' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistoriaClinica.prototype, "tratamiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Última fecha de actualización del expediente' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], HistoriaClinica.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de apertura del expediente' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], HistoriaClinica.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'El paciente (mascota). Solo 1 paciente puede tener 1 historia.' }),
    (0, typeorm_1.Column)({ name: 'mascotaId', unique: true }),
    __metadata("design:type", Number)
], HistoriaClinica.prototype, "mascotaId", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => pet_entity_1.Pet, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'mascotaId' }),
    __metadata("design:type", pet_entity_1.Pet)
], HistoriaClinica.prototype, "mascota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'El último Veterinario que modificó este registro' }),
    (0, typeorm_1.Column)({ name: 'veterinarioId' }),
    __metadata("design:type", Number)
], HistoriaClinica.prototype, "veterinarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role),
    (0, typeorm_1.JoinColumn)({ name: 'veterinarioId' }),
    __metadata("design:type", role_entity_1.Role)
], HistoriaClinica.prototype, "veterinario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Clínica responsable del expediente' }),
    (0, typeorm_1.Column)({ name: 'veterinariaId' }),
    __metadata("design:type", Number)
], HistoriaClinica.prototype, "veterinariaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => veterinaria_entity_1.Veterinaria),
    (0, typeorm_1.JoinColumn)({ name: 'veterinariaId' }),
    __metadata("design:type", veterinaria_entity_1.Veterinaria)
], HistoriaClinica.prototype, "veterinaria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dueño de la mascota en el momento del registro' }),
    (0, typeorm_1.Column)({ name: 'usuarioId' }),
    __metadata("design:type", Number)
], HistoriaClinica.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", user_entity_1.User)
], HistoriaClinica.prototype, "usuario", void 0);
exports.HistoriaClinica = HistoriaClinica = __decorate([
    (0, typeorm_1.Entity)('historias_clinicas')
], HistoriaClinica);
//# sourceMappingURL=historia-clinica.entity.js.map