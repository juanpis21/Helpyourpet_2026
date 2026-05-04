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
exports.StockController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stock_service_1 = require("./stock.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let StockController = class StockController {
    constructor(stockService) {
        this.stockService = stockService;
    }
    getProductosBajoStock() {
        return this.stockService.getProductosBajoStock();
    }
    getProductosPorVencer(dias) {
        return this.stockService.getProductosPorVencer(dias ? +dias : 30);
    }
    getReporteStockPorCategoria() {
        return this.stockService.getReporteStockPorCategoria();
    }
    getReporteStockPorVeterinaria() {
        return this.stockService.getReporteStockPorVeterinaria();
    }
    getReporteValorTotalInventario() {
        return this.stockService.getReporteValorTotalInventario();
    }
    getAlertasStock() {
        return this.stockService.getAlertasStock();
    }
};
exports.StockController = StockController;
__decorate([
    (0, common_1.Get)('bajo-stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos con stock bajo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productos con stock bajo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getProductosBajoStock", null);
__decorate([
    (0, common_1.Get)('por-vencer'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos próximos a vencer' }),
    (0, swagger_1.ApiQuery)({ name: 'dias', description: 'Días para vencimiento', required: false }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productos próximos a vencer' }),
    __param(0, (0, common_1.Query)('dias')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getProductosPorVencer", null);
__decorate([
    (0, common_1.Get)('reporte/categorias'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener reporte de stock por categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reporte de stock por categoría' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getReporteStockPorCategoria", null);
__decorate([
    (0, common_1.Get)('reporte/veterinarias'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener reporte de stock por veterinaria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Reporte de stock por veterinaria' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getReporteStockPorVeterinaria", null);
__decorate([
    (0, common_1.Get)('reporte/valor-total'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener valor total del inventario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Valor total del inventario' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getReporteValorTotalInventario", null);
__decorate([
    (0, common_1.Get)('alertas'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las alertas de stock' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Alertas de stock' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StockController.prototype, "getAlertasStock", null);
exports.StockController = StockController = __decorate([
    (0, swagger_1.ApiTags)('stock'),
    (0, common_1.Controller)('stock'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [stock_service_1.StockService])
], StockController);
//# sourceMappingURL=stock.controller.js.map