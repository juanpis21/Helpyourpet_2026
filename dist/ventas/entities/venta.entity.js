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
exports.Venta = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const detalle_venta_entity_1 = require("./detalle-venta.entity");
let Venta = class Venta {
};
exports.Venta = Venta;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único de la venta', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Venta.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Subtotal de la venta (sin impuestos/descuentos aplicados)', example: 100.50 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total final a pagar', example: 100.50 }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del usuario comprador' }),
    (0, typeorm_1.Column)({ name: 'usuarioId' }),
    __metadata("design:type", Number)
], Venta.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Usuario que realizó la compra', type: () => user_entity_1.User }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", user_entity_1.User)
], Venta.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Detalles de los productos vendidos', type: () => [detalle_venta_entity_1.DetalleVenta] }),
    (0, typeorm_1.OneToMany)(() => detalle_venta_entity_1.DetalleVenta, detalle => detalle.venta, { cascade: true }),
    __metadata("design:type", Array)
], Venta.prototype, "detalles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha en que se registró la venta' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Venta.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Venta.prototype, "updatedAt", void 0);
exports.Venta = Venta = __decorate([
    (0, typeorm_1.Entity)('ventas')
], Venta);
//# sourceMappingURL=venta.entity.js.map