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
exports.CategoriasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categorias_service_1 = require("./categorias.service");
const create_categoria_dto_1 = require("./dto/create-categoria.dto");
const update_categoria_dto_1 = require("./dto/update-categoria.dto");
const categoria_entity_1 = require("./entities/categoria.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CategoriasController = class CategoriasController {
    constructor(categoriasService) {
        this.categoriasService = categoriasService;
    }
    create(createCategoriaDto) {
        return this.categoriasService.create(createCategoriaDto);
    }
    findAll() {
        return this.categoriasService.findAll();
    }
    findOne(id) {
        return this.categoriasService.findOne(+id);
    }
    update(id, updateCategoriaDto) {
        return this.categoriasService.update(+id, updateCategoriaDto);
    }
    remove(id) {
        return this.categoriasService.remove(+id);
    }
};
exports.CategoriasController = CategoriasController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva categoría' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Categoría creada exitosamente', type: categoria_entity_1.Categoria }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La categoría con este código ya existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías', type: [categoria_entity_1.Categoria] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una categoría por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría encontrada', type: categoria_entity_1.Categoria }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría actualizada', type: categoria_entity_1.Categoria }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_categoria_dto_1.UpdateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Categoría eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "remove", null);
exports.CategoriasController = CategoriasController = __decorate([
    (0, swagger_1.ApiTags)('categorias'),
    (0, common_1.Controller)('categorias'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [categorias_service_1.CategoriasService])
], CategoriasController);
//# sourceMappingURL=categorias.controller.js.map