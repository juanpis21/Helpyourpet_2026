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
exports.ProveedoresController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const proveedores_service_1 = require("./proveedores.service");
const create_proveedor_dto_1 = require("./dto/create-proveedor.dto");
const update_proveedor_dto_1 = require("./dto/update-proveedor.dto");
const proveedor_entity_1 = require("./entities/proveedor.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let ProveedoresController = class ProveedoresController {
    constructor(proveedoresService) {
        this.proveedoresService = proveedoresService;
    }
    create(createProveedorDto) {
        return this.proveedoresService.create(createProveedorDto);
    }
    findAll() {
        return this.proveedoresService.findAll();
    }
    findOne(id) {
        return this.proveedoresService.findOne(+id);
    }
    update(id, updateProveedorDto) {
        return this.proveedoresService.update(+id, updateProveedorDto);
    }
    remove(id) {
        return this.proveedoresService.remove(+id);
    }
};
exports.ProveedoresController = ProveedoresController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Proveedor creado exitosamente', type: proveedor_entity_1.Proveedor }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El proveedor con este RUT ya existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proveedor_dto_1.CreateProveedorDto]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los proveedores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de proveedores', type: [proveedor_entity_1.Proveedor] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un proveedor por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proveedor encontrado', type: proveedor_entity_1.Proveedor }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un proveedor' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proveedor actualizado', type: proveedor_entity_1.Proveedor }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_proveedor_dto_1.UpdateProveedorDto]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un proveedor' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Proveedor eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProveedoresController.prototype, "remove", null);
exports.ProveedoresController = ProveedoresController = __decorate([
    (0, swagger_1.ApiTags)('proveedores'),
    (0, common_1.Controller)('proveedores'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [proveedores_service_1.ProveedoresService])
], ProveedoresController);
//# sourceMappingURL=proveedores.controller.js.map