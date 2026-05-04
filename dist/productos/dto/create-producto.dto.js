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
exports.CreateProductoDto = exports.UnidadMedida = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
var UnidadMedida;
(function (UnidadMedida) {
    UnidadMedida["ML"] = "ml";
    UnidadMedida["MG"] = "mg";
    UnidadMedida["TABLETAS"] = "tabletas";
    UnidadMedida["CAPSULAS"] = "capsulas";
    UnidadMedida["UNIDADES"] = "unidades";
    UnidadMedida["KG"] = "kg";
    UnidadMedida["G"] = "g";
    UnidadMedida["L"] = "l";
})(UnidadMedida || (exports.UnidadMedida = UnidadMedida = {}));
class CreateProductoDto {
}
exports.CreateProductoDto = CreateProductoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del producto',
        example: 'Ivermectina 1% Solución Inyectable'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada del producto',
        example: 'Antiparasitario interno para perros y gatos. Presentación de 50ml.'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Código de barras o SKU del producto',
        example: 'IVER001-50ML',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "codigoBarras", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad actual en stock',
        example: 25
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "stockActual", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock mínimo para alertas',
        example: 10
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "stockMinimo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Stock máximo permitido',
        example: 100,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "stockMaximo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio de compra por unidad',
        example: 15.50
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "precioCompra", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio de venta por unidad',
        example: 25.00
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "precioVenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de vencimiento del producto',
        example: '2024-12-31',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "fechaVencimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unidad de medida',
        example: UnidadMedida.ML,
        enum: UnidadMedida
    }),
    (0, class_validator_1.IsEnum)(UnidadMedida),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "unidadMedida", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lote del producto',
        example: 'LOT-2024-001',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "lote", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ubicación física en el almacen',
        example: 'Estantía A-3',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "ubicacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el producto está activo',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], CreateProductoDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la categoría del producto',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "categoriaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la veterinaria',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "veterinariaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen del producto',
        required: false,
        format: 'binary'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "imagen", void 0);
//# sourceMappingURL=create-producto.dto.js.map