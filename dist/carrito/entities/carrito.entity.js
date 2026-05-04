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
exports.Carrito = exports.EstadoCarrito = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const carrito_producto_entity_1 = require("./carrito-producto.entity");
var EstadoCarrito;
(function (EstadoCarrito) {
    EstadoCarrito["ACTIVO"] = "ACTIVO";
    EstadoCarrito["COMPRADO"] = "COMPRADO";
    EstadoCarrito["CANCELADO"] = "CANCELADO";
})(EstadoCarrito || (exports.EstadoCarrito = EstadoCarrito = {}));
let Carrito = class Carrito {
};
exports.Carrito = Carrito;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del carrito',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Carrito.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del carrito',
        example: 'ACTIVO',
        enum: EstadoCarrito
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCarrito,
        default: EstadoCarrito.ACTIVO
    }),
    __metadata("design:type", String)
], Carrito.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario dueño del carrito',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'usuarioId' }),
    __metadata("design:type", Number)
], Carrito.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario dueño del carrito',
        type: () => user_entity_1.User
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Carrito.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Productos en el carrito',
        type: () => [carrito_producto_entity_1.CarritoProducto]
    }),
    (0, typeorm_1.OneToMany)(() => carrito_producto_entity_1.CarritoProducto, carritoProducto => carritoProducto.carrito, { cascade: true }),
    __metadata("design:type", Array)
], Carrito.prototype, "productos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del carrito',
        example: '2026-03-20T10:30:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Carrito.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2026-03-20T10:30:00.000Z'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Carrito.prototype, "updatedAt", void 0);
exports.Carrito = Carrito = __decorate([
    (0, typeorm_1.Entity)('carrito')
], Carrito);
//# sourceMappingURL=carrito.entity.js.map