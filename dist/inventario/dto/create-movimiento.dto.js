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
exports.CreateMovimientoDto = exports.TipoMovimiento = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TipoMovimiento;
(function (TipoMovimiento) {
    TipoMovimiento["ENTRADA"] = "ENTRADA";
    TipoMovimiento["SALIDA"] = "SALIDA";
    TipoMovimiento["AJUSTE"] = "AJUSTE";
    TipoMovimiento["DEVOLUCION"] = "DEVOLUCION";
})(TipoMovimiento || (exports.TipoMovimiento = TipoMovimiento = {}));
class CreateMovimientoDto {
}
exports.CreateMovimientoDto = CreateMovimientoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del producto',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMovimientoDto.prototype, "productoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de movimiento',
        example: TipoMovimiento.ENTRADA,
        enum: TipoMovimiento
    }),
    (0, class_validator_1.IsEnum)(TipoMovimiento),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad movida',
        example: 10
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMovimientoDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Motivo del movimiento',
        example: 'Compra a proveedor'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de documento o referencia',
        example: 'FACT-001234',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "documentoReferencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que realiza el movimiento',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateMovimientoDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionales del movimiento',
        example: 'Medicamento recibido con fecha de vencimiento 2024-12-31',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "notas", void 0);
//# sourceMappingURL=create-movimiento.dto.js.map