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
exports.UpdateMovimientoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_movimiento_dto_1 = require("./create-movimiento.dto");
class UpdateMovimientoDto {
}
exports.UpdateMovimientoDto = UpdateMovimientoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de movimiento',
        example: create_movimiento_dto_1.TipoMovimiento.ENTRADA,
        enum: create_movimiento_dto_1.TipoMovimiento,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_movimiento_dto_1.TipoMovimiento),
    __metadata("design:type", String)
], UpdateMovimientoDto.prototype, "tipoMovimiento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad movida',
        example: 10,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMovimientoDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Motivo del movimiento',
        example: 'Compra a proveedor',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMovimientoDto.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de documento o referencia',
        example: 'FACT-001234',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMovimientoDto.prototype, "documentoReferencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionales del movimiento',
        example: 'Medicamento recibido con fecha de vencimiento 2024-12-31',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMovimientoDto.prototype, "notas", void 0);
//# sourceMappingURL=update-movimiento.dto.js.map