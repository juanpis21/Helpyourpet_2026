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
exports.CreateNotificacionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const notificacion_entity_1 = require("../entities/notificacion.entity");
class CreateNotificacionDto {
}
exports.CreateNotificacionDto = CreateNotificacionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del usuario al que va dirigida', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateNotificacionDto.prototype, "usuarioId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Mensaje de la notificación', example: 'Recordatorio: Mañana es la cita de tu mascota.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificacionDto.prototype, "mensaje", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nivel o tipo', enum: notificacion_entity_1.TipoNotificacion }),
    (0, class_validator_1.IsEnum)(notificacion_entity_1.TipoNotificacion),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificacionDto.prototype, "tipo", void 0);
//# sourceMappingURL=create-notificacion.dto.js.map