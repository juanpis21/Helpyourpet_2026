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
exports.Producto = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const veterinaria_entity_1 = require("../../veterinarias/entities/veterinaria.entity");
const categoria_entity_1 = require("./categoria.entity");
const movimiento_inventario_entity_1 = require("./movimiento-inventario.entity");
let Producto = class Producto {
};
exports.Producto = Producto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del producto',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Producto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del producto',
        example: 'Ivermectina 1% Solución Inyectable'
    }),
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Producto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada del producto',
        example: 'Antiparasitario interno para perros y gatos. Presentación de 50ml.'
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Producto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de barras o SKU del producto',
        example: 'IVER001-50ML',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 50, unique: true, nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "codigoBarras", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad actual en stock',
        example: 25
    }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], Producto.prototype, "stockActual", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock mínimo para alertas',
        example: 10
    }),
    (0, typeorm_1.Column)({ type: 'int', default: 5 }),
    __metadata("design:type", Number)
], Producto.prototype, "stockMinimo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock máximo permitido',
        example: 100
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Producto.prototype, "stockMaximo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio de compra por unidad',
        example: 15.50
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "precioCompra", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio de venta por unidad',
        example: 25.00
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "precioVenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de vencimiento del producto',
        example: '2024-12-31',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Producto.prototype, "fechaVencimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unidad de medida',
        example: 'ml',
        enum: ['ml', 'mg', 'tabletas', 'capsulas', 'unidades', 'kg', 'g', 'l']
    }),
    (0, typeorm_1.Column)({
        length: 20,
        enum: ['ml', 'mg', 'tabletas', 'capsulas', 'unidades', 'kg', 'g', 'l']
    }),
    __metadata("design:type", String)
], Producto.prototype, "unidadMedida", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lote del producto',
        example: 'LOT-2024-001',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "lote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ubicación física en el almacen',
        example: 'Estantía A-3',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Producto.prototype, "ubicacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el producto está activo',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Producto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoría del producto',
        type: () => categoria_entity_1.Categoria
    }),
    (0, typeorm_1.ManyToOne)(() => categoria_entity_1.Categoria, categoria => categoria.productos),
    __metadata("design:type", categoria_entity_1.Categoria)
], Producto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Veterinaria donde se encuentra el producto',
        type: () => veterinaria_entity_1.Veterinaria
    }),
    (0, typeorm_1.ManyToOne)(() => veterinaria_entity_1.Veterinaria, veterinaria => veterinaria.productos),
    __metadata("design:type", veterinaria_entity_1.Veterinaria)
], Producto.prototype, "veterinaria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Movimientos de inventario de este producto',
        type: () => [movimiento_inventario_entity_1.MovimientoInventario]
    }),
    (0, typeorm_1.OneToMany)(() => movimiento_inventario_entity_1.MovimientoInventario, movimiento => movimiento.producto),
    __metadata("design:type", Array)
], Producto.prototype, "movimientos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Producto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Producto.prototype, "updatedAt", void 0);
exports.Producto = Producto = __decorate([
    (0, typeorm_1.Entity)('productos')
], Producto);
//# sourceMappingURL=producto.entity.js.map