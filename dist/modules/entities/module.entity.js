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
exports.Module = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const role_entity_1 = require("../../roles/entities/role.entity");
let Module = class Module {
};
exports.Module = Module;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del módulo' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Module.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'inicio', description: 'Nombre del módulo' }),
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Module.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Módulo de inicio', description: 'Descripción del módulo' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Module.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Roles que tienen acceso a este módulo', type: () => [role_entity_1.Role] }),
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role, (role) => role.modules),
    (0, typeorm_1.JoinTable)({
        name: 'role_modules',
        joinColumn: { name: 'moduleId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'roleId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Module.prototype, "roles", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Module.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de actualización' }),
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Module.prototype, "updatedAt", void 0);
exports.Module = Module = __decorate([
    (0, typeorm_1.Entity)('modules')
], Module);
//# sourceMappingURL=module.entity.js.map