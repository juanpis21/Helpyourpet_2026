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
exports.Veterinaria = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const perfil_veterinario_entity_1 = require("../../perfiles-veterinarios/entities/perfil-veterinario.entity");
const emergencia_entity_1 = require("../../emergencias/entities/emergencia.entity");
const producto_entity_1 = require("../../productos/entities/producto.entity");
let Veterinaria = class Veterinaria {
};
exports.Veterinaria = Veterinaria;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la veterinaria',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Veterinaria.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la veterinaria',
        example: 'Clínica Veterinaria San Felipe'
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Veterinaria.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección de la veterinaria',
        example: 'Calle Principal #123, Ciudad'
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Veterinaria.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono de contacto',
        example: '+1234567890'
    }),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Veterinaria.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email de contacto',
        example: 'contacto@clinicavet.com'
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Veterinaria.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción de la veterinaria',
        example: 'Clínica veterinaria con más de 10 años de experiencia, especializada en atención de mascotas pequeñas y grandes.'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Veterinaria.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la veterinaria',
        example: 'Activa'
    }),
    (0, typeorm_1.OneToMany)(() => perfil_veterinario_entity_1.PerfilVeterinario, perfilVeterinario => perfilVeterinario.veterinariaPrincipal),
    __metadata("design:type", Array)
], Veterinaria.prototype, "veterinarios", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => emergencia_entity_1.Emergencia, emergencia => emergencia.veterinaria),
    __metadata("design:type", Array)
], Veterinaria.prototype, "emergencias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Productos del inventario de esta veterinaria',
        type: () => [producto_entity_1.Producto]
    }),
    (0, typeorm_1.OneToMany)(() => producto_entity_1.Producto, producto => producto.veterinaria),
    __metadata("design:type", Array)
], Veterinaria.prototype, "productos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT de la veterinaria',
        example: '76.123.456-7'
    }),
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Veterinaria.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la veterinaria está activa en el sistema',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Veterinaria.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Veterinaria.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Veterinaria.prototype, "updatedAt", void 0);
exports.Veterinaria = Veterinaria = __decorate([
    (0, typeorm_1.Entity)('veterinarias')
], Veterinaria);
//# sourceMappingURL=veterinaria.entity.js.map