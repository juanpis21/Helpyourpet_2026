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
exports.UpdateProveedorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateProveedorDto {
}
exports.UpdateProveedorDto = UpdateProveedorDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del proveedor',
        example: 'Laboratorios Bayer S.A.',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'RUT o identificación fiscal del proveedor',
        example: '76.123.456-7',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "rut", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre de contacto',
        example: 'Juan Pérez',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "contacto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono del proveedor',
        example: '+56 2 23456789',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "telefono", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email del proveedor',
        example: 'contacto@bayer.cl',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Dirección del proveedor',
        example: 'Av. Principal #1234, Santiago',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ciudad del proveedor',
        example: 'Santiago',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "ciudad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'País del proveedor',
        example: 'Chile',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "pais", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Condiciones de pago',
        example: '30 días',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "condicionesPago", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tiempo de entrega en días',
        example: 5,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateProveedorDto.prototype, "tiempoEntregaDias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Notas adicionales del proveedor',
        example: 'Proveedor principal de antiparasitarios',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateProveedorDto.prototype, "notas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el proveedor está activo',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateProveedorDto.prototype, "isActive", void 0);
//# sourceMappingURL=update-proveedor.dto.js.map