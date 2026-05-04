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
exports.DetalleVenta = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const venta_entity_1 = require("./venta.entity");
const producto_entity_1 = require("../../productos/entities/producto.entity");
let DetalleVenta = class DetalleVenta {
};
exports.DetalleVenta = DetalleVenta;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único del detalle', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad vendida del producto', example: 2 }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio unitario congelado al momento de la venta', example: 25.00 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "precioUnitario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la venta a la que pertenece' }),
    (0, typeorm_1.Column)({ name: 'ventaId' }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "ventaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Venta asociada', type: () => venta_entity_1.Venta }),
    (0, typeorm_1.ManyToOne)(() => venta_entity_1.Venta, venta => venta.detalles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'ventaId' }),
    __metadata("design:type", venta_entity_1.Venta)
], DetalleVenta.prototype, "venta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del producto vendido' }),
    (0, typeorm_1.Column)({ name: 'productoId' }),
    __metadata("design:type", Number)
], DetalleVenta.prototype, "productoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Producto vendido', type: () => producto_entity_1.Producto }),
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto),
    (0, typeorm_1.JoinColumn)({ name: 'productoId' }),
    __metadata("design:type", producto_entity_1.Producto)
], DetalleVenta.prototype, "producto", void 0);
exports.DetalleVenta = DetalleVenta = __decorate([
    (0, typeorm_1.Entity)('detalle_venta')
], DetalleVenta);
//# sourceMappingURL=detalle-venta.entity.js.map