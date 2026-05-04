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
exports.CreatePetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class CreatePetDto {
}
exports.CreatePetDto = CreatePetDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de la mascota (obligatorio)',
        example: 'Firulais',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Especie de la mascota: Perro, Gato, Ave, Pez, etc. (obligatorio)',
        example: 'Perro',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "species", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raza de la mascota (obligatorio)',
        example: 'Labrador',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "breed", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Edad de la mascota en años (0-50, obligatorio)',
        example: 3,
        required: true,
        minimum: 0,
        maximum: 50
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(50),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Género: M (Macho) o F (Hembra) (obligatorio)',
        example: 'M',
        required: true,
        enum: ['M', 'F']
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "gender", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Color de la mascota (obligatorio)',
        example: 'Dorado',
        required: true
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Peso de la mascota en kg (0.1-200, obligatorio)',
        example: 25.5,
        required: true,
        minimum: 0.1,
        maximum: 200
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    (0, class_validator_1.Max)(200),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "weight", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción o notas adicionales sobre la mascota (opcional)',
        example: 'Mascota muy juguetona y amigable',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL o base64 de la foto de la mascota (opcional)',
        example: 'https://example.com/mascota.jpg',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePetDto.prototype, "foto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del dueño de la mascota (opcional, se asigna automáticamente si no se proporciona)',
        example: 2,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePetDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la mascota está activa en el sistema (opcional, por defecto true)',
        example: true,
        required: false,
        default: true
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Boolean),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePetDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-pet.dto.js.map