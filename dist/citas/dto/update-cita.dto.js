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
exports.UpdateCitaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const create_cita_dto_1 = require("./create-cita.dto");
class UpdateCitaDto {
}
exports.UpdateCitaDto = UpdateCitaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Motivo de la cita',
        example: 'Control general y vacunación',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], UpdateCitaDto.prototype, "motivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora de la cita',
        example: '2026-03-20T10:30:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCitaDto.prototype, "fechaHora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la cita',
        example: 'Completada',
        enum: create_cita_dto_1.CitaEstado,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_cita_dto_1.CitaEstado),
    __metadata("design:type", String)
], UpdateCitaDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionales de la cita',
        example: 'El paciente es nervioso, se necesita manejo especial',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], UpdateCitaDto.prototype, "notas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que solicita la cita',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCitaDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del veterinario asignado',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCitaDto.prototype, "idVeterinario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la mascota del paciente',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCitaDto.prototype, "mascotaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la historia clínica asociada',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateCitaDto.prototype, "idHistoriaClinica", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la cita está activa en el sistema',
        example: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateCitaDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-cita.dto.js.map