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
exports.CreateHistoriaClinicaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateHistoriaClinicaDto {
}
exports.CreateHistoriaClinicaDto = CreateHistoriaClinicaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la mascota (Paciente)' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateHistoriaClinicaDto.prototype, "mascotaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: 'ID del Veterinario responsable de la apertura' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateHistoriaClinicaDto.prototype, "veterinarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la veterinaria' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateHistoriaClinicaDto.prototype, "veterinariaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'ID del dueño de la mascota' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateHistoriaClinicaDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sano. Primera revisión de cachorro. Sin anomalías.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHistoriaClinicaDto.prototype, "diagnostico", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Desparasitación estándar (Drontal).' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateHistoriaClinicaDto.prototype, "tratamiento", void 0);
//# sourceMappingURL=create-historia-clinica.dto.js.map