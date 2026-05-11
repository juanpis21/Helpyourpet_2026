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
exports.CreateVeterinariaDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateVeterinariaDto {
}
exports.CreateVeterinariaDto = CreateVeterinariaDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la veterinaria',
        example: 'Clinica Veterinaria San Francisco'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVeterinariaDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección de la veterinaria',
        example: 'Calle Principal #123, Santiago'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateVeterinariaDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono de contacto',
        example: '+56 2 23456789'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(9),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateVeterinariaDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email de contacto',
        example: 'contacto@clinicavetsanfrancisco.cl'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], CreateVeterinariaDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT de la veterinaria',
        example: '76.123.456-7'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], CreateVeterinariaDto.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción de la veterinaria',
        example: 'Clínica veterinaria con más de 10 años de experiencia, especializada en atención de mascotas pequeñas y grandes.',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CreateVeterinariaDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la veterinaria está activa en el sistema',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateVeterinariaDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del administrador asociado a la veterinaria',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVeterinariaDto.prototype, "adminId", void 0);
//# sourceMappingURL=create-veterinaria.dto.js.map