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
exports.MovimientosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const movimientos_service_1 = require("./movimientos.service");
const create_movimiento_dto_1 = require("./dto/create-movimiento.dto");
const update_movimiento_dto_1 = require("./dto/update-movimiento.dto");
const movimiento_inventario_entity_1 = require("./entities/movimiento-inventario.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let MovimientosController = class MovimientosController {
    constructor(movimientosService) {
        this.movimientosService = movimientosService;
    }
    create(createMovimientoDto) {
        return this.movimientosService.create(createMovimientoDto);
    }
    findAll() {
        return this.movimientosService.findAll();
    }
    findOne(id) {
        return this.movimientosService.findOne(+id);
    }
    findByProducto(productoId) {
        return this.movimientosService.findByProducto(+productoId);
    }
    update(id, updateMovimientoDto) {
        return this.movimientosService.update(+id, updateMovimientoDto);
    }
    remove(id) {
        return this.movimientosService.remove(+id);
    }
};
exports.MovimientosController = MovimientosController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo movimiento de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movimiento creado exitosamente', type: movimiento_inventario_entity_1.MovimientoInventario }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Stock insuficiente para esta salida' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movimiento_dto_1.CreateMovimientoDto]),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los movimientos de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de movimientos', type: [movimiento_inventario_entity_1.MovimientoInventario] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un movimiento por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del movimiento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento encontrado', type: movimiento_inventario_entity_1.MovimientoInventario }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movimiento no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('producto/:productoId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por producto' }),
    (0, swagger_1.ApiParam)({ name: 'productoId', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos del producto', type: [movimiento_inventario_entity_1.MovimientoInventario] }),
    __param(0, (0, common_1.Param)('productoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "findByProducto", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un movimiento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del movimiento' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento actualizado', type: movimiento_inventario_entity_1.MovimientoInventario }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movimiento no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_movimiento_dto_1.UpdateMovimientoDto]),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un movimiento' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del movimiento' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Movimiento eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movimiento no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MovimientosController.prototype, "remove", null);
exports.MovimientosController = MovimientosController = __decorate([
    (0, swagger_1.ApiTags)('movimientos'),
    (0, common_1.Controller)('movimientos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [movimientos_service_1.MovimientosService])
], MovimientosController);
//# sourceMappingURL=movimientos.controller.js.map