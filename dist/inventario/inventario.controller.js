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
exports.InventarioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventario_service_1 = require("./inventario.service");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const update_producto_dto_1 = require("./dto/update-producto.dto");
const create_categoria_dto_1 = require("./dto/create-categoria.dto");
const update_categoria_dto_1 = require("./dto/update-categoria.dto");
const create_movimiento_dto_1 = require("./dto/create-movimiento.dto");
const update_movimiento_dto_1 = require("./dto/update-movimiento.dto");
const create_proveedor_dto_1 = require("./dto/create-proveedor.dto");
const update_proveedor_dto_1 = require("./dto/update-proveedor.dto");
const producto_entity_1 = require("./entities/producto.entity");
const categoria_entity_1 = require("./entities/categoria.entity");
const movimiento_inventario_entity_1 = require("./entities/movimiento-inventario.entity");
const proveedor_entity_1 = require("./entities/proveedor.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let InventarioController = class InventarioController {
    constructor(inventarioService) {
        this.inventarioService = inventarioService;
    }
    createProducto(createProductoDto) {
        return this.inventarioService.createProducto(createProductoDto);
    }
    findAllProductos() {
        return this.inventarioService.findAllProductos();
    }
    findProductoById(id) {
        return this.inventarioService.findProductoById(+id);
    }
    updateProducto(id, updateProductoDto) {
        return this.inventarioService.updateProducto(+id, updateProductoDto);
    }
    removeProducto(id) {
        return this.inventarioService.removeProducto(+id);
    }
    createCategoria(createCategoriaDto) {
        return this.inventarioService.createCategoria(createCategoriaDto);
    }
    findAllCategorias() {
        return this.inventarioService.findAllCategorias();
    }
    findCategoriaById(id) {
        return this.inventarioService.findCategoriaById(+id);
    }
    updateCategoria(id, updateCategoriaDto) {
        return this.inventarioService.updateCategoria(+id, updateCategoriaDto);
    }
    removeCategoria(id) {
        return this.inventarioService.removeCategoria(+id);
    }
    createMovimiento(createMovimientoDto) {
        return this.inventarioService.createMovimiento(createMovimientoDto);
    }
    findAllMovimientos() {
        return this.inventarioService.findAllMovimientos();
    }
    findMovimientoById(id) {
        return this.inventarioService.findMovimientoById(+id);
    }
    updateMovimiento(id, updateMovimientoDto) {
        return this.inventarioService.updateMovimiento(+id, updateMovimientoDto);
    }
    removeMovimiento(id) {
        return this.inventarioService.removeMovimiento(+id);
    }
    createProveedor(createProveedorDto) {
        return this.inventarioService.createProveedor(createProveedorDto);
    }
    findAllProveedores() {
        return this.inventarioService.findAllProveedores();
    }
    findProveedorById(id) {
        return this.inventarioService.findProveedorById(+id);
    }
    updateProveedor(id, updateProveedorDto) {
        return this.inventarioService.updateProveedor(+id, updateProveedorDto);
    }
    removeProveedor(id) {
        return this.inventarioService.removeProveedor(+id);
    }
    getProductosBajoStock() {
        return this.inventarioService.getProductosBajoStock();
    }
    getProductosPorVencer(dias) {
        return this.inventarioService.getProductosPorVencer(dias ? +dias : 30);
    }
    getMovimientosPorProducto(productoId) {
        return this.inventarioService.getMovimientosPorProducto(+productoId);
    }
    getReporteStockPorCategoria() {
        return this.inventarioService.getReporteStockPorCategoria();
    }
};
exports.InventarioController = InventarioController;
__decorate([
    (0, common_1.Post)('productos'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo producto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado exitosamente', type: producto_entity_1.Producto }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El producto con este código de barras ya existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "createProducto", null);
__decorate([
    (0, common_1.Get)('productos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos', type: [producto_entity_1.Producto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findAllProductos", null);
__decorate([
    (0, common_1.Get)('productos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto encontrado', type: producto_entity_1.Producto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findProductoById", null);
__decorate([
    (0, common_1.Patch)('productos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado', type: producto_entity_1.Producto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_producto_dto_1.UpdateProductoDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "updateProducto", null);
__decorate([
    (0, common_1.Delete)('productos/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Producto eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "removeProducto", null);
__decorate([
    (0, common_1.Post)('categorias'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva categoría' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Categoría creada exitosamente', type: categoria_entity_1.Categoria }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La categoría con este código ya existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "createCategoria", null);
__decorate([
    (0, common_1.Get)('categorias'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías', type: [categoria_entity_1.Categoria] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findAllCategorias", null);
__decorate([
    (0, common_1.Get)('categorias/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una categoría por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría encontrada', type: categoria_entity_1.Categoria }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findCategoriaById", null);
__decorate([
    (0, common_1.Patch)('categorias/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría actualizada', type: categoria_entity_1.Categoria }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_categoria_dto_1.UpdateCategoriaDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "updateCategoria", null);
__decorate([
    (0, common_1.Delete)('categorias/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una categoría' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la categoría' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Categoría eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "removeCategoria", null);
__decorate([
    (0, common_1.Post)('movimientos'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo movimiento de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movimiento creado exitosamente', type: movimiento_inventario_entity_1.MovimientoInventario }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Stock insuficiente para esta salida' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movimiento_dto_1.CreateMovimientoDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "createMovimiento", null);
__decorate([
    (0, common_1.Get)('movimientos'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los movimientos de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de movimientos', type: [movimiento_inventario_entity_1.MovimientoInventario] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findAllMovimientos", null);
__decorate([
    (0, common_1.Get)('movimientos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un movimiento por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del movimiento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento encontrado', type: movimiento_inventario_entity_1.MovimientoInventario }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movimiento no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findMovimientoById", null);
__decorate([
    (0, common_1.Patch)('movimientos/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un movimiento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del movimiento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento actualizado', type: movimiento_inventario_entity_1.MovimientoInventario }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movimiento no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_movimiento_dto_1.UpdateMovimientoDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "updateMovimiento", null);
__decorate([
    (0, common_1.Delete)('movimientos/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un movimiento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del movimiento' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Movimiento eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movimiento no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "removeMovimiento", null);
__decorate([
    (0, common_1.Post)('proveedores'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Proveedor creado exitosamente', type: proveedor_entity_1.Proveedor }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El proveedor con este RUT ya existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_proveedor_dto_1.CreateProveedorDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "createProveedor", null);
__decorate([
    (0, common_1.Get)('proveedores'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los proveedores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de proveedores', type: [proveedor_entity_1.Proveedor] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findAllProveedores", null);
__decorate([
    (0, common_1.Get)('proveedores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un proveedor por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proveedor encontrado', type: proveedor_entity_1.Proveedor }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "findProveedorById", null);
__decorate([
    (0, common_1.Patch)('proveedores/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un proveedor' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Proveedor actualizado', type: proveedor_entity_1.Proveedor }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_proveedor_dto_1.UpdateProveedorDto]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "updateProveedor", null);
__decorate([
    (0, common_1.Delete)('proveedores/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un proveedor' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del proveedor' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Proveedor eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Proveedor no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "removeProveedor", null);
__decorate([
    (0, common_1.Get)('productos/stock-bajo'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos con stock bajo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productos con stock bajo', type: [producto_entity_1.Producto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "getProductosBajoStock", null);
__decorate([
    (0, common_1.Get)('productos/por-vencer'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos próximos a vencer' }),
    (0, swagger_1.ApiQuery)({ name: 'dias', description: 'Días para vencimiento', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productos próximos a vencer', type: [producto_entity_1.Producto] }),
    __param(0, (0, common_1.Query)('dias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "getProductosPorVencer", null);
__decorate([
    (0, common_1.Get)('movimientos/producto/:productoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por producto' }),
    (0, swagger_1.ApiParam)({ name: 'productoId', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos del producto', type: [movimiento_inventario_entity_1.MovimientoInventario] }),
    __param(0, (0, common_1.Param)('productoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "getMovimientosPorProducto", null);
__decorate([
    (0, common_1.Get)('reportes/stock-por-categoria'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener reporte de stock por categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reporte de stock por categoría' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InventarioController.prototype, "getReporteStockPorCategoria", null);
exports.InventarioController = InventarioController = __decorate([
    (0, swagger_1.ApiTags)('inventario'),
    (0, common_1.Controller)('inventario'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [inventario_service_1.InventarioService])
], InventarioController);
//# sourceMappingURL=inventario.controller.js.map