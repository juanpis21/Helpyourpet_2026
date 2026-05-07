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
exports.RegisterUserByVetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class RegisterUserByVetDto {
}
exports.RegisterUserByVetDto = RegisterUserByVetDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombres',
        example: 'Juan Carlos'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserByVetDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Apellidos',
        example: 'Pérez García'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserByVetDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono',
        example: '+1234567890',
        required: false,
        maxLength: 20
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(20),
    __metadata("design:type", String)
], RegisterUserByVetDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de documento',
        example: 'Cédula'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserByVetDto.prototype, "documentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de documento',
        example: '12345678'
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserByVetDto.prototype, "documentNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Edad',
        example: 25,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterUserByVetDto.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección',
        example: 'Calle 123 #45-67',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterUserByVetDto.prototype, "address", void 0);
//# sourceMappingURL=register-user-by-vet.dto.js.map