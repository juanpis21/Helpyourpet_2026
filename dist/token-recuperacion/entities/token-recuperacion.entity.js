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
exports.TokenRecuperacion = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let TokenRecuperacion = class TokenRecuperacion {
};
exports.TokenRecuperacion = TokenRecuperacion;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la solicitud', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TokenRecuperacion.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'String alfanumérico generado de un solo uso' }),
    (0, typeorm_1.Column)({ type: 'varchar', unique: true }),
    __metadata("design:type", String)
], TokenRecuperacion.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de fallecimiento/expiración física del token' }),
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TokenRecuperacion.prototype, "fechaExpiracion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del Usuario' }),
    (0, typeorm_1.Column)({ name: 'usuarioId' }),
    __metadata("design:type", Number)
], TokenRecuperacion.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", user_entity_1.User)
], TokenRecuperacion.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TokenRecuperacion.prototype, "createdAt", void 0);
exports.TokenRecuperacion = TokenRecuperacion = __decorate([
    (0, typeorm_1.Entity)('token_recuperacion')
], TokenRecuperacion);
//# sourceMappingURL=token-recuperacion.entity.js.map