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
exports.CreateCalificacionDto = exports.EstadoCalificacion = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var EstadoCalificacion;
(function (EstadoCalificacion) {
    EstadoCalificacion["PENDIENTE"] = "PENDIENTE";
    EstadoCalificacion["APROBADA"] = "APROBADA";
    EstadoCalificacion["RECHAZADA"] = "RECHAZADA";
})(EstadoCalificacion || (exports.EstadoCalificacion = EstadoCalificacion = {}));
class CreateCalificacionDto {
}
exports.CreateCalificacionDto = CreateCalificacionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Puntuación del servicio (1-5)',
        example: 5
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(5),
    __metadata("design:type", Number)
], CreateCalificacionDto.prototype, "puntuacion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Comentario de la calificación',
        example: 'Excelente servicio, muy profesional el veterinario',
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCalificacionDto.prototype, "comentario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del usuario que califica (opcional, se usa JWT por defecto)',
        example: 1,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalificacionDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del servicio calificado',
        example: 1
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalificacionDto.prototype, "servicioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del veterinario atendido (opcional)',
        example: 2,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateCalificacionDto.prototype, "veterinarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado de la calificación',
        example: EstadoCalificacion.APROBADA,
        enum: EstadoCalificacion,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(EstadoCalificacion),
    __metadata("design:type", String)
], CreateCalificacionDto.prototype, "estado", void 0);
//# sourceMappingURL=create-calificacion.dto.js.map