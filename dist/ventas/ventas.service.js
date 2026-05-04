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
exports.VentasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_entity_1 = require("./entities/venta.entity");
const detalle_venta_entity_1 = require("./entities/detalle-venta.entity");
const carrito_service_1 = require("../carrito/carrito.service");
const carrito_entity_1 = require("../carrito/entities/carrito.entity");
const producto_entity_1 = require("../productos/entities/producto.entity");
let VentasService = class VentasService {
    constructor(ventaRepository, carritoService, dataSource) {
        this.ventaRepository = ventaRepository;
        this.carritoService = carritoService;
        this.dataSource = dataSource;
    }
    async checkout(usuarioId, checkoutDto) {
        const carrito = await this.carritoService.findCarritoActivo(usuarioId);
        if (!carrito.productos || carrito.productos.length === 0) {
            throw new common_1.BadRequestException('El carrito está vacío. No se puede procesar la venta.');
        }
        let subtotal = 0;
        carrito.productos.forEach(item => {
            subtotal += item.cantidad * Number(item.precioUnitario);
        });
        const total = subtotal;
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const nuevaVenta = new venta_entity_1.Venta();
            nuevaVenta.usuarioId = usuarioId;
            nuevaVenta.subtotal = subtotal;
            nuevaVenta.total = total;
            const ventaGuardada = await queryRunner.manager.save(venta_entity_1.Venta, nuevaVenta);
            for (const item of carrito.productos) {
                const producto = await queryRunner.manager.findOne(producto_entity_1.Producto, {
                    where: { id: item.productoId },
                    lock: { mode: 'pessimistic_write' }
                });
                if (!producto) {
                    throw new common_1.NotFoundException(`Producto ${item.productoId} no encontrado`);
                }
                if (producto.stockActual < item.cantidad) {
                    throw new common_1.BadRequestException(`Sin stock suficiente para el producto: ${producto.nombre}. Stock disponible: ${producto.stockActual}`);
                }
                const detalle = new detalle_venta_entity_1.DetalleVenta();
                detalle.ventaId = ventaGuardada.id;
                detalle.productoId = item.productoId;
                detalle.cantidad = item.cantidad;
                detalle.precioUnitario = item.precioUnitario;
                await queryRunner.manager.save(detalle_venta_entity_1.DetalleVenta, detalle);
                producto.stockActual -= item.cantidad;
                await queryRunner.manager.save(producto_entity_1.Producto, producto);
            }
            carrito.estado = carrito_entity_1.EstadoCarrito.COMPRADO;
            await queryRunner.manager.save(carrito);
            await queryRunner.commitTransaction();
            return this.findOne(ventaGuardada.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            console.error('Error procesando checkout:', error);
            throw new common_1.InternalServerErrorException('Ocurrió un error al procesar el pago y la venta');
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll() {
        return this.ventaRepository.find({
            relations: ['usuario', 'detalles', 'detalles.producto'],
            order: { fecha: 'DESC' }
        });
    }
    async findByUsuario(usuarioId) {
        return this.ventaRepository.find({
            where: { usuarioId },
            relations: ['detalles', 'detalles.producto'],
            order: { fecha: 'DESC' }
        });
    }
    async findOne(id) {
        const venta = await this.ventaRepository.findOne({
            where: { id },
            relations: ['usuario', 'detalles', 'detalles.producto']
        });
        if (!venta) {
            throw new common_1.NotFoundException(`Venta con ID ${id} no encontrada`);
        }
        return venta;
    }
};
exports.VentasService = VentasService;
exports.VentasService = VentasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        carrito_service_1.CarritoService,
        typeorm_2.DataSource])
], VentasService);
//# sourceMappingURL=ventas.service.js.map