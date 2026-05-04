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
exports.Permission = exports.ModuleName = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
var ModuleName;
(function (ModuleName) {
    ModuleName["INICIO"] = "inicio";
    ModuleName["SOBRE_NOSOTROS"] = "sobre-nosotros";
    ModuleName["ADOPCION"] = "adopcion";
    ModuleName["TIENDA"] = "tienda";
    ModuleName["REPORTE"] = "reporte";
    ModuleName["CALIFICACION"] = "calificacion";
    ModuleName["VETERINARIO"] = "veterinario";
    ModuleName["SERVICIOS"] = "servicios";
    ModuleName["PASARELA_PAGOS"] = "pasarela-pagos";
    ModuleName["PERFIL_USUARIO"] = "perfil-usuario";
    ModuleName["PERFIL_VETERINARIO"] = "perfil-veterinario";
    ModuleName["PANEL_ADMIN"] = "panel-admin";
    ModuleName["RECOVERY"] = "recovery";
})(ModuleName || (exports.ModuleName = ModuleName = {}));
let Permission = class Permission {
};
exports.Permission = Permission;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID del permiso' }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Permission.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ModuleName.PERFIL_USUARIO,
        description: 'Nombre del módulo',
        enum: ModuleName
    }),
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ModuleName,
    }),
    __metadata("design:type", String)
], Permission.prototype, "moduleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Si tiene acceso al módulo' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "canAccess", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Si puede crear' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "canCreate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Si puede leer' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "canRead", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Si puede actualizar' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "canUpdate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true, description: 'Si puede eliminar' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Permission.prototype, "canDelete", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Usuario asociado', type: () => user_entity_1.User }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Permission.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Permission.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de creación' }),
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Permission.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de actualización' }),
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Permission.prototype, "updatedAt", void 0);
exports.Permission = Permission = __decorate([
    (0, typeorm_1.Entity)('permissions')
], Permission);
//# sourceMappingURL=permission.entity.js.map