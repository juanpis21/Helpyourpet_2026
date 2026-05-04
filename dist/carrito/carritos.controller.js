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
exports.CarritosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const carrito_service_1 = require("./carrito.service");
const create_carrito_dto_1 = require("./dto/create-carrito.dto");
const update_carrito_dto_1 = require("./dto/update-carrito.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CarritosController = class CarritosController {
    constructor(carritoService) {
        this.carritoService = carritoService;
    }
    async getMiCarrito(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return await this.carritoService.findCarritoActivo(usuarioId);
    }
    async getMisCarritos(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return await this.carritoService.findByUsuario(usuarioId);
    }
    async getResumen(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return await this.carritoService.getResumenCarrito(usuarioId);
    }
    async findAll() {
        return await this.carritoService.findAll();
    }
    async create(req, createCarritoDto) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return await this.carritoService.create(usuarioId, createCarritoDto);
    }
    async findOne(id) {
        return await this.carritoService.findOne(+id);
    }
    async update(id, updateCarritoDto) {
        return await this.carritoService.update(+id, updateCarritoDto);
    }
    async remove(id) {
        return await this.carritoService.remove(+id);
    }
};
exports.CarritosController = CarritosController;
__decorate([
    (0, common_1.Get)('mi-carrito'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener mi carrito activo' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "getMiCarrito", null);
__decorate([
    (0, common_1.Get)('mis-carritos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos mis carritos' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "getMisCarritos", null);
__decorate([
    (0, common_1.Get)('resumen'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener resumen de mi carrito' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "getResumen", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los carritos (Admin)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo carrito' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_carrito_dto_1.CreateCarritoDto]),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener carrito por ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar carrito' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_carrito_dto_1.UpdateCarritoDto]),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar carrito' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CarritosController.prototype, "remove", null);
exports.CarritosController = CarritosController = __decorate([
    (0, swagger_1.ApiTags)('carritos'),
    (0, common_1.Controller)('carritos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [carrito_service_1.CarritoService])
], CarritosController);
//# sourceMappingURL=carritos.controller.js.map