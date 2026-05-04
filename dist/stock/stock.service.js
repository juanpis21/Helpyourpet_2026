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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("../productos/entities/producto.entity");
const movimiento_inventario_entity_1 = require("../movimientos/entities/movimiento-inventario.entity");
const productos_service_1 = require("../productos/productos.service");
let StockService = class StockService {
    constructor(productosRepository, movimientosRepository, productosService) {
        this.productosRepository = productosRepository;
        this.movimientosRepository = movimientosRepository;
        this.productosService = productosService;
    }
    async getProductosBajoStock() {
        return this.productosRepository.find({
            where: { isActive: true },
            relations: ['veterinaria'],
            select: ['id', 'nombre', 'stockActual', 'stockMinimo', 'categoriaId', 'veterinaria']
        }).then(productos => productos.filter(p => p.stockActual <= p.stockMinimo));
    }
    async getProductosPorVencer(dias = 30) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() + dias);
        return this.productosRepository.find({
            where: {
                isActive: true,
                fechaVencimiento: (0, typeorm_2.LessThan)(fechaLimite)
            },
            relations: ['veterinaria'],
            select: ['id', 'nombre', 'fechaVencimiento', 'categoriaId', 'veterinaria']
        });
    }
    async getReporteStockPorCategoria() {
        return this.productosRepository
            .createQueryBuilder('producto')
            .leftJoin('categorias', 'categoria', 'categoria.id = producto.categoriaId')
            .select('categoria.nombre', 'categoria')
            .addSelect('COUNT(producto.id)', 'totalProductos')
            .addSelect('SUM(producto.stockActual)', 'stockTotal')
            .addSelect('SUM(producto.precioCompra * producto.stockActual)', 'valorInventario')
            .where('producto.isActive = :isActive', { isActive: true })
            .groupBy('categoria.id')
            .addGroupBy('categoria.nombre')
            .orderBy('categoria.nombre', 'ASC')
            .getRawMany();
    }
    async getReporteStockPorVeterinaria() {
        return this.productosRepository
            .createQueryBuilder('producto')
            .leftJoin('veterinarias', 'veterinaria', 'veterinaria.id = producto.veterinariaId')
            .select('veterinaria.nombre', 'veterinaria')
            .addSelect('COUNT(producto.id)', 'totalProductos')
            .addSelect('SUM(producto.stockActual)', 'stockTotal')
            .addSelect('SUM(producto.precioCompra * producto.stockActual)', 'valorInventario')
            .where('producto.isActive = :isActive', { isActive: true })
            .groupBy('veterinaria.id')
            .addGroupBy('veterinaria.nombre')
            .orderBy('veterinaria.nombre', 'ASC')
            .getRawMany();
    }
    async getReporteValorTotalInventario() {
        const result = await this.productosRepository
            .createQueryBuilder('producto')
            .select('COUNT(producto.id)', 'totalProductos')
            .addSelect('SUM(producto.stockActual)', 'stockTotal')
            .addSelect('SUM(producto.precioCompra * producto.stockActual)', 'valorInventario')
            .addSelect('SUM(producto.precioVenta * producto.stockActual)', 'valorVenta')
            .where('producto.isActive = :isActive', { isActive: true })
            .getRawOne();
        return result || {
            totalProductos: 0,
            stockTotal: 0,
            valorInventario: 0,
            valorVenta: 0
        };
    }
    async getAlertasStock() {
        const productosBajoStock = await this.getProductosBajoStock();
        const productosPorVencer = await this.getProductosPorVencer(30);
        return {
            productosBajoStock: {
                total: productosBajoStock.length,
                productos: productosBajoStock
            },
            productosPorVencer: {
                total: productosPorVencer.length,
                productos: productosPorVencer
            },
            totalAlertas: productosBajoStock.length + productosPorVencer.length
        };
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(1, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        productos_service_1.ProductosService])
], StockService);
//# sourceMappingURL=stock.service.js.map