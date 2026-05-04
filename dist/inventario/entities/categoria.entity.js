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
exports.Categoria = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const producto_entity_1 = require("./producto.entity");
let Categoria = class Categoria {
};
exports.Categoria = Categoria;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la categoría',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Categoria.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la categoría',
        example: 'Antiparasitarios'
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Categoria.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción de la categoría',
        example: 'Medicamentos para control de parásitos internos y externos'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de la categoría',
        example: 'ANTI-001'
    }),
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    __metadata("design:type", String)
], Categoria.prototype, "codigo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Color para identificar la categoría',
        example: '#FF6B6B',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 7, nullable: true }),
    __metadata("design:type", String)
], Categoria.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la categoría está activa',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Categoria.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Productos de esta categoría',
        type: () => [producto_entity_1.Producto]
    }),
    (0, typeorm_1.OneToMany)(() => producto_entity_1.Producto, producto => producto.categoria),
    __metadata("design:type", Array)
], Categoria.prototype, "productos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Categoria.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Categoria.prototype, "updatedAt", void 0);
exports.Categoria = Categoria = __decorate([
    (0, typeorm_1.Entity)('categorias')
], Categoria);
//# sourceMappingURL=categoria.entity.js.map