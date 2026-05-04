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
exports.UpdateServicioDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const create_servicio_dto_1 = require("./create-servicio.dto");
class UpdateServicioDto {
}
exports.UpdateServicioDto = UpdateServicioDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del servicio',
        example: 'Consulta General',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateServicioDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada del servicio',
        example: 'Consulta veterinaria general para revisión de salud de mascotas',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateServicioDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio base del servicio',
        example: 25000.00,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value !== undefined && value !== '' ? Number(value) : undefined),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateServicioDto.prototype, "precioBase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Duración estimada en minutos',
        example: 30,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value !== undefined && value !== '' ? Number(value) : undefined),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(5),
    (0, class_validator_1.Max)(480),
    __metadata("design:type", Number)
], UpdateServicioDto.prototype, "duracionMinutos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de servicio',
        example: create_servicio_dto_1.TipoServicio.CONSULTA,
        enum: create_servicio_dto_1.TipoServicio,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(create_servicio_dto_1.TipoServicio),
    __metadata("design:type", String)
], UpdateServicioDto.prototype, "tipoServicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Requiere cita previa',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServicioDto.prototype, "requiereCita", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del servicio',
        example: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateServicioDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la veterinaria',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value !== undefined && value !== '' ? Number(value) : undefined),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], UpdateServicioDto.prototype, "veterinariaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Ruta de imagen del servicio',
        example: '/uploads/servicios/imagen.jpg',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateServicioDto.prototype, "imagen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Etiquetas para búsqueda',
        example: 'consulta,general,revision,salud',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateServicioDto.prototype, "etiquetas", void 0);
//# sourceMappingURL=update-servicio.dto.js.map