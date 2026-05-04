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
exports.Emergencia = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const pet_entity_1 = require("../../pets/entities/pet.entity");
const role_entity_1 = require("../../roles/entities/role.entity");
const veterinaria_entity_1 = require("../../veterinarias/entities/veterinaria.entity");
let Emergencia = class Emergencia {
};
exports.Emergencia = Emergencia;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la emergencia',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Emergencia.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de emergencia',
        example: 'accidente',
        enum: ['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro']
    }),
    (0, typeorm_1.Column)({
        length: 20,
        enum: ['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro']
    }),
    __metadata("design:type", String)
], Emergencia.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora de la emergencia',
        example: '2026-03-19T23:00:00.000Z'
    }),
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Emergencia.prototype, "fechayhora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada de la emergencia',
        example: 'Atropellamiento vehicular, mascota presenta fractura en pata trasera y sangrado'
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Emergencia.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Mascota que presenta la emergencia',
        type: () => pet_entity_1.Pet
    }),
    (0, typeorm_1.ManyToOne)(() => pet_entity_1.Pet, pet => pet.emergencias),
    __metadata("design:type", pet_entity_1.Pet)
], Emergencia.prototype, "mascota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Veterinario que atiende la emergencia',
        type: () => role_entity_1.Role
    }),
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, role => role.emergencias),
    __metadata("design:type", role_entity_1.Role)
], Emergencia.prototype, "veterinario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Veterinaria donde se registra la emergencia',
        type: () => veterinaria_entity_1.Veterinaria
    }),
    (0, typeorm_1.ManyToOne)(() => veterinaria_entity_1.Veterinaria, veterinaria => veterinaria.emergencias),
    __metadata("design:type", veterinaria_entity_1.Veterinaria)
], Emergencia.prototype, "veterinaria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la emergencia está activa en el sistema',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Emergencia.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
        example: '2026-03-19T23:00:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Emergencia.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2026-03-19T23:00:00.000Z'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Emergencia.prototype, "updatedAt", void 0);
exports.Emergencia = Emergencia = __decorate([
    (0, typeorm_1.Entity)('emergencias')
], Emergencia);
//# sourceMappingURL=emergencia.entity.js.map