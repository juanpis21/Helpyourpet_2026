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
exports.CreateEmergenciaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateEmergenciaDto {
}
exports.CreateEmergenciaDto = CreateEmergenciaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de emergencia',
        example: 'accidente',
        enum: ['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro']
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsEnum)(['accidente', 'enfermedad', 'intoxicacion', 'parto', 'cirugia', 'otro']),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateEmergenciaDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada de la emergencia',
        example: 'Atropellamiento vehicular, mascota presenta fractura en pata trasera y sangrado'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CreateEmergenciaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la mascota que presenta la emergencia',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEmergenciaDto.prototype, "mascotaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del rol del veterinario que atiende la emergencia',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEmergenciaDto.prototype, "veterinarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la veterinaria donde se registra la emergencia',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateEmergenciaDto.prototype, "veterinariaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha y hora de la emergencia (opcional, usa actual si no se proporciona)',
        example: '2026-03-19T23:00:00.000Z',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateEmergenciaDto.prototype, "fechayhora", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la emergencia está activa en el sistema',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateEmergenciaDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-emergencia.dto.js.map