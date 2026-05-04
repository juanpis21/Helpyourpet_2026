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
exports.MovimientoInventario = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let MovimientoInventario = class MovimientoInventario {
};
exports.MovimientoInventario = MovimientoInventario;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del movimiento',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del producto',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'productoId' }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "productoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de movimiento',
        example: 'ENTRADA',
        enum: ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION']
    }),
    (0, typeorm_1.Column)({
        length: 20,
        enum: ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION']
    }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad movida',
        example: 10
    }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock antes del movimiento',
        example: 25
    }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "stockAnterior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock después del movimiento',
        example: 35
    }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "stockNuevo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Motivo del movimiento',
        example: 'Compra a proveedor'
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de documento o referencia',
        example: 'FACT-001234',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "documentoReferencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que realiza el movimiento',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'usuarioId' }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario que realizó el movimiento',
        type: () => user_entity_1.User
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.id),
    __metadata("design:type", user_entity_1.User)
], MovimientoInventario.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionales del movimiento',
        example: 'Medicamento recibido con fecha de vencimiento 2024-12-31',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "notas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora del movimiento',
        example: '2026-03-20T10:30:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "fechaMovimiento", void 0);
exports.MovimientoInventario = MovimientoInventario = __decorate([
    (0, typeorm_1.Entity)('movimientos_inventario')
], MovimientoInventario);
//# sourceMappingURL=movimiento-inventario.entity.js.map