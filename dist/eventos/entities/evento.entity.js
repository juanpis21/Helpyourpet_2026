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
exports.Evento = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const veterinaria_entity_1 = require("../../veterinarias/entities/veterinaria.entity");
let Evento = class Evento {
};
exports.Evento = Evento;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID único del evento', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Evento.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Título de la campaña o evento', example: 'Gran Feria de Adopción' }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Evento.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción detallada', example: 'Ven y dale un hogar a un peludito.' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Evento.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL de la imagen o afiche publicitario', required: false }),
    (0, typeorm_1.Column)({ type: 'varchar', length: 500, nullable: true }),
    __metadata("design:type", String)
], Evento.prototype, "imagen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de inicio programada' }),
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Evento.prototype, "fechaInicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de cierre programada' }),
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Evento.prototype, "fechaFin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la veterinaria que lo organiza' }),
    (0, typeorm_1.Column)({ name: 'veterinariaId' }),
    __metadata("design:type", Number)
], Evento.prototype, "veterinariaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => veterinaria_entity_1.Veterinaria, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'veterinariaId' }),
    __metadata("design:type", veterinaria_entity_1.Veterinaria)
], Evento.prototype, "veterinaria", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Evento.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Evento.prototype, "updatedAt", void 0);
exports.Evento = Evento = __decorate([
    (0, typeorm_1.Entity)('eventos')
], Evento);
//# sourceMappingURL=evento.entity.js.map