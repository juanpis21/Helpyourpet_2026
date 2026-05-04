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
exports.ReporteMaltrato = exports.EstadoReporte = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const pet_entity_1 = require("../../pets/entities/pet.entity");
var EstadoReporte;
(function (EstadoReporte) {
    EstadoReporte["PENDIENTE"] = "PENDIENTE";
    EstadoReporte["EN_REVISION"] = "EN_REVISION";
    EstadoReporte["RESUELTO"] = "RESUELTO";
})(EstadoReporte || (exports.EstadoReporte = EstadoReporte = {}));
let ReporteMaltrato = class ReporteMaltrato {
};
exports.ReporteMaltrato = ReporteMaltrato;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del reporte', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReporteMaltrato.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción detallada de la situación y posible ubicación' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ReporteMaltrato.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estado actual de la investigación', enum: EstadoReporte }),
    (0, typeorm_1.Column)({ type: 'enum', enum: EstadoReporte, default: EstadoReporte.PENDIENTE }),
    __metadata("design:type", String)
], ReporteMaltrato.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del Usuario denunciante (Obligatorio)' }),
    (0, typeorm_1.Column)({ name: 'usuarioId' }),
    __metadata("design:type", Number)
], ReporteMaltrato.prototype, "usuarioId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'usuarioId' }),
    __metadata("design:type", user_entity_1.User)
], ReporteMaltrato.prototype, "usuario", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la mascota (Opcional, en caso de estar registrado en el sistema)', nullable: true }),
    (0, typeorm_1.Column)({ name: 'mascotaId', nullable: true }),
    __metadata("design:type", Number)
], ReporteMaltrato.prototype, "mascotaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pet_entity_1.Pet, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'mascotaId' }),
    __metadata("design:type", pet_entity_1.Pet)
], ReporteMaltrato.prototype, "mascota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación del reporte original' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReporteMaltrato.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReporteMaltrato.prototype, "updatedAt", void 0);
exports.ReporteMaltrato = ReporteMaltrato = __decorate([
    (0, typeorm_1.Entity)('reportes_maltrato')
], ReporteMaltrato);
//# sourceMappingURL=reporte-maltrato.entity.js.map