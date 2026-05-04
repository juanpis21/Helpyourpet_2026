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
exports.Servicio = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const veterinaria_entity_1 = require("../../veterinarias/entities/veterinaria.entity");
let Servicio = class Servicio {
};
exports.Servicio = Servicio;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del servicio',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Servicio.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nombre del servicio',
        example: 'Consulta General'
    }),
    (0, typeorm_1.Column)({ length: 200 }),
    __metadata("design:type", String)
], Servicio.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción detallada del servicio',
        example: 'Consulta veterinaria general para revisión de salud de mascotas'
    }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Servicio.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Precio base del servicio',
        example: 25000.00
    }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Servicio.prototype, "precioBase", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Duración estimada en minutos',
        example: 30
    }),
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Servicio.prototype, "duracionMinutos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de servicio',
        example: 'CONSULTA',
        enum: ['CONSULTA', 'CIRUGIA', 'VACUNACION', 'DESparasitacion', 'ESTETICA', 'LABORATORIO', 'EMERGENCIA', 'CHECKUP']
    }),
    (0, typeorm_1.Column)({
        length: 20,
        enum: ['CONSULTA', 'CIRUGIA', 'VACUNACION', 'DESparasitacion', 'ESTETICA', 'LABORATORIO', 'EMERGENCIA', 'CHECKUP']
    }),
    __metadata("design:type", String)
], Servicio.prototype, "tipoServicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Requiere cita previa',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Servicio.prototype, "requiereCita", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Estado del servicio',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Servicio.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID de la veterinaria',
        example: 1
    }),
    (0, typeorm_1.Column)({ name: 'veterinariaId' }),
    __metadata("design:type", Number)
], Servicio.prototype, "veterinariaId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Veterinaria que ofrece el servicio',
        type: () => veterinaria_entity_1.Veterinaria
    }),
    (0, typeorm_1.ManyToOne)(() => veterinaria_entity_1.Veterinaria, veterinaria => veterinaria.id),
    __metadata("design:type", veterinaria_entity_1.Veterinaria)
], Servicio.prototype, "veterinaria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de imagen del servicio',
        example: 'https://example.com/images/consulta-general.jpg',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], Servicio.prototype, "imagen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Etiquetas para búsqueda',
        example: 'consulta,general,revision,salud',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 300, nullable: true }),
    __metadata("design:type", String)
], Servicio.prototype, "etiquetas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación del registro', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Servicio.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de última actualización', example: '2026-03-20T10:30:00.000Z' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Servicio.prototype, "updatedAt", void 0);
exports.Servicio = Servicio = __decorate([
    (0, typeorm_1.Entity)('servicios')
], Servicio);
//# sourceMappingURL=servicio.entity.js.map