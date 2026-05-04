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
exports.Proveedor = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let Proveedor = class Proveedor {
};
exports.Proveedor = Proveedor;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del proveedor',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Proveedor.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del proveedor',
        example: 'Laboratorios Bayer S.A.'
    }),
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Proveedor.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT o identificación fiscal del proveedor',
        example: '76.123.456-7'
    }),
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Proveedor.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de contacto',
        example: 'Juan Pérez',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "contacto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono del proveedor',
        example: '+56 2 23456789',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del proveedor',
        example: 'contacto@bayer.cl',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección del proveedor',
        example: 'Av. Principal #1234, Santiago',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ciudad del proveedor',
        example: 'Santiago',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "ciudad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'País del proveedor',
        example: 'Chile',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "pais", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condiciones de pago',
        example: '30 días',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "condicionesPago", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tiempo de entrega en días',
        example: 5,
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Proveedor.prototype, "tiempoEntregaDias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionales del proveedor',
        example: 'Proveedor principal de antiparasitarios',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Proveedor.prototype, "notas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el proveedor está activo',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Proveedor.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Proveedor.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Proveedor.prototype, "updatedAt", void 0);
exports.Proveedor = Proveedor = __decorate([
    (0, typeorm_1.Entity)('proveedores')
], Proveedor);
//# sourceMappingURL=proveedor.entity.js.map