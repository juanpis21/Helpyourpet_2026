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
exports.CarritoProducto = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const carrito_entity_1 = require("./carrito.entity");
const producto_entity_1 = require("../../productos/entities/producto.entity");
let CarritoProducto = class CarritoProducto {
};
exports.CarritoProducto = CarritoProducto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del item en el carrito',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CarritoProducto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad del producto',
        example: 2
    }),
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], CarritoProducto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio unitario al momento de agregar al carrito',
        example: 25000
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CarritoProducto.prototype, "precioUnitario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del carrito',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'carritoId' }),
    __metadata("design:type", Number)
], CarritoProducto.prototype, "carritoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Carrito al que pertenece este item',
        type: () => carrito_entity_1.Carrito
    }),
    (0, typeorm_1.ManyToOne)(() => carrito_entity_1.Carrito),
    __metadata("design:type", carrito_entity_1.Carrito)
], CarritoProducto.prototype, "carrito", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del producto',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'productoId' }),
    __metadata("design:type", Number)
], CarritoProducto.prototype, "productoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Producto agregado al carrito',
        type: () => producto_entity_1.Producto
    }),
    (0, typeorm_1.ManyToOne)(() => producto_entity_1.Producto),
    __metadata("design:type", producto_entity_1.Producto)
], CarritoProducto.prototype, "producto", void 0);
exports.CarritoProducto = CarritoProducto = __decorate([
    (0, typeorm_1.Entity)('carrito_productos')
], CarritoProducto);
//# sourceMappingURL=carrito-producto.entity.js.map