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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerfilesVeterinariosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const perfiles_veterinarios_service_1 = require("./perfiles-veterinarios.service");
const create_perfil_veterinario_dto_1 = require("./dto/create-perfil-veterinario.dto");
const update_perfil_veterinario_dto_1 = require("./dto/update-perfil-veterinario.dto");
const perfil_veterinario_entity_1 = require("./entities/perfil-veterinario.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PerfilesVeterinariosController = class PerfilesVeterinariosController {
    constructor(perfilesVeterinariosService) {
        this.perfilesVeterinariosService = perfilesVeterinariosService;
    }
    create(createPerfilVeterinarioDto) {
        return this.perfilesVeterinariosService.create(createPerfilVeterinarioDto);
    }
    findAll() {
        return this.perfilesVeterinariosService.findAll();
    }
    findByUsuario(usuarioId) {
        return this.perfilesVeterinariosService.findByUsuario(+usuarioId);
    }
    findByVeterinaria(veterinariaId) {
        return this.perfilesVeterinariosService.findByVeterinaria(+veterinariaId);
    }
    findByEspecialidad(especialidad) {
        return this.perfilesVeterinariosService.findByEspecialidad(especialidad);
    }
    findOne(id) {
        return this.perfilesVeterinariosService.findOne(+id);
    }
    update(id, updatePerfilVeterinarioDto) {
        return this.perfilesVeterinariosService.update(+id, updatePerfilVeterinarioDto);
    }
    remove(id) {
        return this.perfilesVeterinariosService.remove(+id);
    }
};
exports.PerfilesVeterinariosController = PerfilesVeterinariosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo perfil veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Perfil veterinario creado exitosamente', type: perfil_veterinario_entity_1.PerfilVeterinario }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario o veterinaria no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El usuario ya tiene un perfil veterinario o la matrícula ya está registrada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_perfil_veterinario_dto_1.CreatePerfilVeterinarioDto]),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los perfiles veterinarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de perfiles veterinarios', type: [perfil_veterinario_entity_1.PerfilVeterinario] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('usuario/:usuarioId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfiles veterinarios por usuario' }),
    (0, swagger_1.ApiParam)({ name: 'usuarioId', description: 'ID del usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de perfiles veterinarios del usuario', type: [perfil_veterinario_entity_1.PerfilVeterinario] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('usuarioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "findByUsuario", null);
__decorate([
    (0, common_1.Get)('veterinaria/:veterinariaId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfiles veterinarios por veterinaria' }),
    (0, swagger_1.ApiParam)({ name: 'veterinariaId', description: 'ID de la veterinaria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de perfiles veterinarios de la veterinaria', type: [perfil_veterinario_entity_1.PerfilVeterinario] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Veterinaria no encontrada' }),
    __param(0, (0, common_1.Param)('veterinariaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "findByVeterinaria", null);
__decorate([
    (0, common_1.Get)('especialidad/:especialidad'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener perfiles veterinarios por especialidad' }),
    (0, swagger_1.ApiParam)({ name: 'especialidad', description: 'Especialidad del veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de perfiles veterinarios por especialidad', type: [perfil_veterinario_entity_1.PerfilVeterinario] }),
    __param(0, (0, common_1.Param)('especialidad')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "findByEspecialidad", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un perfil veterinario por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del perfil veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil veterinario encontrado', type: perfil_veterinario_entity_1.PerfilVeterinario }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Perfil veterinario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un perfil veterinario' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del perfil veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Perfil veterinario actualizado', type: perfil_veterinario_entity_1.PerfilVeterinario }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Perfil veterinario, usuario o veterinaria no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El usuario ya tiene un perfil veterinario o la matrícula ya está registrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_perfil_veterinario_dto_1.UpdatePerfilVeterinarioDto]),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un perfil veterinario' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del perfil veterinario' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Perfil veterinario eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Perfil veterinario no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PerfilesVeterinariosController.prototype, "remove", null);
exports.PerfilesVeterinariosController = PerfilesVeterinariosController = __decorate([
    (0, swagger_1.ApiTags)('perfiles-veterinarios'),
    (0, common_1.Controller)('perfiles-veterinarios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [perfiles_veterinarios_service_1.PerfilesVeterinariosService])
], PerfilesVeterinariosController);
//# sourceMappingURL=perfiles-veterinarios.controller.js.map