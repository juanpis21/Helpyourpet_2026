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
exports.UpdateHistorialCitaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_historial_cita_dto_1 = require("./create-historial-cita.dto");
class UpdateHistorialCitaDto {
}
exports.UpdateHistorialCitaDto = UpdateHistorialCitaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de cambio realizado',
        enum: create_historial_cita_dto_1.TipoCambio,
        example: create_historial_cita_dto_1.TipoCambio.ACTUALIZACION,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_historial_cita_dto_1.TipoCambio),
    __metadata("design:type", String)
], UpdateHistorialCitaDto.prototype, "tipoCambio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción del cambio realizado',
        example: 'Se actualizó la fecha de la cita',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHistorialCitaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Valor anterior del campo cambiado',
        example: '2026-03-20T10:30:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHistorialCitaDto.prototype, "valorAnterior", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nuevo valor del campo cambiado',
        example: '2026-03-21T14:00:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHistorialCitaDto.prototype, "valorNuevo", void 0);
//# sourceMappingURL=update-historial-cita.dto.js.map