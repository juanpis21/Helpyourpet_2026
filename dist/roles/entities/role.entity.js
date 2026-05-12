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
exports.Role = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const emergencia_entity_1 = require("../../emergencias/entities/emergencia.entity");
const module_entity_1 = require("../../modules/entities/module.entity");
let Role = class Role {
};
exports.Role = Role;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del rol' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Role.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del rol', example: 'admin' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Role.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del rol', example: 'Administrador del sistema' }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Role.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Usuarios con este rol', type: () => [user_entity_1.User] }),
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, user => user.role),
    __metadata("design:type", Array)
], Role.prototype, "users", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Emergencias atendidas con este rol', type: () => [emergencia_entity_1.Emergencia] }),
    (0, typeorm_1.OneToMany)(() => emergencia_entity_1.Emergencia, emergencia => emergencia.veterinario),
    __metadata("design:type", Array)
], Role.prototype, "emergencias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Módulos a los que este rol da acceso', type: () => [module_entity_1.Module] }),
    (0, typeorm_1.ManyToMany)(() => module_entity_1.Module, (module) => module.roles),
    __metadata("design:type", Array)
], Role.prototype, "modules", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Role.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de actualización' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Role.prototype, "updatedAt", void 0);
exports.Role = Role = __decorate([
    (0, typeorm_1.Entity)('roles')
], Role);
//# sourceMappingURL=role.entity.js.map