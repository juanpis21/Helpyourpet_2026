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
exports.HistoriaClinica = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const pet_entity_1 = require("../../pets/entities/pet.entity");
let HistoriaClinica = class HistoriaClinica {
};
exports.HistoriaClinica = HistoriaClinica;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la Historia Clínica', example: 1 }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'id_historia' }),
    __metadata("design:type", Number)
], HistoriaClinica.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID de la mascota', example: 1 }),
    (0, typeorm_1.Column)({ name: 'id_mascota', unique: true }),
    __metadata("design:type", Number)
], HistoriaClinica.prototype, "mascotaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pet_entity_1.Pet, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id_mascota' }),
    __metadata("design:type", pet_entity_1.Pet)
], HistoriaClinica.prototype, "mascota", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alergias conocidas', example: 'Alérgica al amoxiland' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistoriaClinica.prototype, "alergias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Antecedentes médicos', example: 'Cirugía de cadera 2024' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistoriaClinica.prototype, "antecedentes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vacunas aplicadas', example: 'Rabia, Parvovirus, Moquillo' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistoriaClinica.prototype, "vacunas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: '¿Está esterilizado/a?', example: false }),
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], HistoriaClinica.prototype, "esterilizado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Observaciones generales', example: 'Paciente tranquilo' }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HistoriaClinica.prototype, "observaciones_generales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de apertura del expediente' }),
    (0, typeorm_1.CreateDateColumn)({ name: 'fecha_apertura', type: 'date' }),
    __metadata("design:type", Date)
], HistoriaClinica.prototype, "fechaApertura", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('ConsultaMedica', 'historiaClinica'),
    __metadata("design:type", Array)
], HistoriaClinica.prototype, "consultas", void 0);
exports.HistoriaClinica = HistoriaClinica = __decorate([
    (0, typeorm_1.Entity)('historias_clinicas')
], HistoriaClinica);
//# sourceMappingURL=historia-clinica.entity.js.map