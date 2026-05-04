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
exports.PerfilVeterinario = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const veterinaria_entity_1 = require("../../veterinarias/entities/veterinaria.entity");
const cita_entity_1 = require("../../citas/entities/cita.entity");
const role_entity_1 = require("../../roles/entities/role.entity");
let PerfilVeterinario = class PerfilVeterinario {
};
exports.PerfilVeterinario = PerfilVeterinario;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único del perfil veterinario',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PerfilVeterinario.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Especialidad del veterinario',
        example: 'Medicina General Canina'
    }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], PerfilVeterinario.prototype, "especialidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Número de matrícula profesional',
        example: 'MV-2023-1234'
    }),
    (0, typeorm_1.Column)({ length: 50, unique: true }),
    __metadata("design:type", String)
], PerfilVeterinario.prototype, "matricula", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Años de experiencia',
        example: 5
    }),
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PerfilVeterinario.prototype, "aniosExperiencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Universidad de egreso',
        example: 'Universidad Nacional de Veterinaria',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], PerfilVeterinario.prototype, "universidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Teléfono de contacto profesional',
        example: '+1234567890',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], PerfilVeterinario.prototype, "telefonoProfesional", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Email profesional',
        example: 'dr.veterinario@clinica.com',
        required: false
    }),
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], PerfilVeterinario.prototype, "emailProfesional", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Biografía o descripción profesional',
        example: 'Veterinario con especialización en medicina canina y felina',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PerfilVeterinario.prototype, "biografia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Usuario asociado al perfil veterinario',
        type: () => user_entity_1.User
    }),
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, user => user.perfilVeterinario),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.User)
], PerfilVeterinario.prototype, "usuario", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.Role, role => role.perfilesVeterinarios),
    __metadata("design:type", role_entity_1.Role)
], PerfilVeterinario.prototype, "rol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Veterinaria principal donde trabaja',
        type: () => veterinaria_entity_1.Veterinaria
    }),
    (0, typeorm_1.ManyToOne)(() => veterinaria_entity_1.Veterinaria, veterinaria => veterinaria.veterinarios),
    __metadata("design:type", veterinaria_entity_1.Veterinaria)
], PerfilVeterinario.prototype, "veterinariaPrincipal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Citas asignadas',
        type: () => [cita_entity_1.Cita]
    }),
    (0, typeorm_1.OneToMany)(() => cita_entity_1.Cita, cita => cita.veterinario),
    __metadata("design:type", Array)
], PerfilVeterinario.prototype, "citas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si el perfil veterinario está activo',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], PerfilVeterinario.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PerfilVeterinario.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2026-03-19T20:00:00.000Z'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PerfilVeterinario.prototype, "updatedAt", void 0);
exports.PerfilVeterinario = PerfilVeterinario = __decorate([
    (0, typeorm_1.Entity)('perfiles_veterinarios')
], PerfilVeterinario);
//# sourceMappingURL=perfil-veterinario.entity.js.map