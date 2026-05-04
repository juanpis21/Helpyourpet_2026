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
exports.CreateHistorialCitaDto = exports.TipoCambio = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var TipoCambio;
(function (TipoCambio) {
    TipoCambio["CREACION"] = "CREACION";
    TipoCambio["ACTUALIZACION"] = "ACTUALIZACION";
    TipoCambio["CANCELACION"] = "CANCELACION";
    TipoCambio["COMPLETACION"] = "COMPLETACION";
})(TipoCambio || (exports.TipoCambio = TipoCambio = {}));
class CreateHistorialCitaDto {
}
exports.CreateHistorialCitaDto = CreateHistorialCitaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la cita asociada',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateHistorialCitaDto.prototype, "citaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de cambio realizado',
        enum: TipoCambio,
        example: TipoCambio.CREACION
    }),
    (0, class_validator_1.IsEnum)(TipoCambio),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHistorialCitaDto.prototype, "tipoCambio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del cambio realizado',
        example: 'Se creó la cita para control general y vacunación'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHistorialCitaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor anterior del campo cambiado',
        example: 'Programada',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHistorialCitaDto.prototype, "valorAnterior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo valor del campo cambiado',
        example: 'Cancelada',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHistorialCitaDto.prototype, "valorNuevo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que realizó el cambio',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateHistorialCitaDto.prototype, "usuarioId", void 0);
//# sourceMappingURL=create-historial-cita.dto.js.map