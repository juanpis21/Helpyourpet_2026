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
exports.CarritoProductosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const carrito_service_1 = require("./carrito.service");
const add_producto_dto_1 = require("./dto/add-producto.dto");
const update_cantidad_dto_1 = require("./dto/update-cantidad.dto");
const carrito_producto_entity_1 = require("./entities/carrito-producto.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let CarritoProductosController = class CarritoProductosController {
    constructor(carritoService) {
        this.carritoService = carritoService;
    }
    async getProductosMiCarrito(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        const carrito = await this.carritoService.findCarritoActivo(usuarioId);
        return await this.carritoService.getProductosCarrito(carrito.id);
    }
    async addProducto(req, addProductoDto) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return await this.carritoService.addProducto(usuarioId, addProductoDto);
    }
    async vaciarCarrito(req) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return await this.carritoService.vaciarCarrito(usuarioId);
    }
    async updateCantidad(req, productoId, updateCantidadDto) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        console.log(`[CARRITO] Actualizando producto ${productoId} a cantidad ${updateCantidadDto.cantidad} para usuario ${usuarioId}`);
        return await this.carritoService.updateCantidad(usuarioId, +productoId, updateCantidadDto.cantidad);
    }
    async removeProducto(req, productoId) {
        const usuarioId = req.user?.userId || req.user?.sub || req.user?.id;
        return await this.carritoService.removeProducto(usuarioId, +productoId);
    }
};
exports.CarritoProductosController = CarritoProductosController;
__decorate([
    (0, common_1.Get)('mi-carrito'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos de mi carrito activo' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarritoProductosController.prototype, "getProductosMiCarrito", null);
__decorate([
    (0, common_1.Post)('agregar'),
    (0, swagger_1.ApiOperation)({ summary: 'Agregar producto al carrito' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, add_producto_dto_1.AddProductoDto]),
    __metadata("design:returntype", Promise)
], CarritoProductosController.prototype, "addProducto", null);
__decorate([
    (0, common_1.Delete)('vaciar'),
    (0, swagger_1.ApiOperation)({ summary: 'Vaciar todos los productos de mi carrito' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CarritoProductosController.prototype, "vaciarCarrito", null);
__decorate([
    (0, common_1.Patch)('actualizar-cantidad/:productoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar cantidad de producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cantidad actualizada', type: carrito_producto_entity_1.CarritoProducto }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productoId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_cantidad_dto_1.UpdateCantidadDto]),
    __metadata("design:returntype", Promise)
], CarritoProductosController.prototype, "updateCantidad", null);
__decorate([
    (0, common_1.Delete)('remover/:productoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remover producto del carrito' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('productoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CarritoProductosController.prototype, "removeProducto", null);
exports.CarritoProductosController = CarritoProductosController = __decorate([
    (0, swagger_1.ApiTags)('carrito-productos'),
    (0, common_1.Controller)('carrito-productos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [carrito_service_1.CarritoService])
], CarritoProductosController);
//# sourceMappingURL=carrito-productos.controller.js.map