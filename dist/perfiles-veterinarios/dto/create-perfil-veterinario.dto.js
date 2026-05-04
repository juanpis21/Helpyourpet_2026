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
exports.CreatePerfilVeterinarioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreatePerfilVeterinarioDto {
}
exports.CreatePerfilVeterinarioDto = CreatePerfilVeterinarioDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Especialidad del veterinario',
        example: 'Medicina General Canina'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePerfilVeterinarioDto.prototype, "especialidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de matrícula profesional',
        example: 'MV-2023-1234'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreatePerfilVeterinarioDto.prototype, "matricula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Años de experiencia',
        example: 5,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePerfilVeterinarioDto.prototype, "aniosExperiencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Universidad de egreso',
        example: 'Universidad Nacional de Veterinaria',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreatePerfilVeterinarioDto.prototype, "universidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono de contacto profesional',
        example: '+1234567890',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreatePerfilVeterinarioDto.prototype, "telefonoProfesional", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email profesional',
        example: 'dr.veterinario@clinica.com',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreatePerfilVeterinarioDto.prototype, "emailProfesional", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Biografía o descripción profesional',
        example: 'Veterinario con especialización en medicina canina y felina',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreatePerfilVeterinarioDto.prototype, "biografia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario asociado',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePerfilVeterinarioDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la veterinaria principal',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePerfilVeterinarioDto.prototype, "veterinariaPrincipalId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el perfil veterinario está activo en el sistema',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreatePerfilVeterinarioDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-perfil-veterinario.dto.js.map