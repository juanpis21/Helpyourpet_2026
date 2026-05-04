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
exports.Pet = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const cita_entity_1 = require("../../citas/entities/cita.entity");
const emergencia_entity_1 = require("../../emergencias/entities/emergencia.entity");
let Pet = class Pet {
};
exports.Pet = Pet;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la mascota',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Pet.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la mascota',
        example: 'Firulais'
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Pet.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Especie de la mascota',
        example: 'Perro'
    }),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Pet.prototype, "species", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raza de la mascota',
        example: 'Labrador'
    }),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Pet.prototype, "breed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Edad de la mascota',
        example: 3
    }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], Pet.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Género de la mascota',
        example: 'Macho'
    }),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Pet.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Color de la mascota',
        example: 'Dorado'
    }),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], Pet.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Peso de la mascota en kg',
        example: 25.5
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2 }),
    __metadata("design:type", Number)
], Pet.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción o notas adicionales sobre la mascota',
        example: 'Mascota muy juguetona y amigable'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pet.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL o base64 de la foto de la mascota',
        example: 'https://example.com/mascota.jpg',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Pet.prototype, "foto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del dueño de la mascota',
        example: 2
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Pet.prototype, "ownerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.pets),
    __metadata("design:type", user_entity_1.User)
], Pet.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cita_entity_1.Cita, cita => cita.mascota),
    __metadata("design:type", Array)
], Pet.prototype, "citas", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => emergencia_entity_1.Emergencia, emergencia => emergencia.mascota),
    __metadata("design:type", Array)
], Pet.prototype, "emergencias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la mascota está activa en el sistema',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Pet.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Pet.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Pet.prototype, "updatedAt", void 0);
exports.Pet = Pet = __decorate([
    (0, typeorm_1.Entity)('pets')
], Pet);
//# sourceMappingURL=pet.entity.js.map