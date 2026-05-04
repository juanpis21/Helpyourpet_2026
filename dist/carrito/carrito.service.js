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
exports.CarritoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const carrito_entity_1 = require("./entities/carrito.entity");
const carrito_producto_entity_1 = require("./entities/carrito-producto.entity");
const carrito_entity_2 = require("./entities/carrito.entity");
const productos_service_1 = require("../productos/productos.service");
let CarritoService = class CarritoService {
    constructor(carritoRepository, carritoProductoRepository, productosService) {
        this.carritoRepository = carritoRepository;
        this.carritoProductoRepository = carritoProductoRepository;
        this.productosService = productosService;
    }
    async create(usuarioId, createCarritoDto) {
        const carrito = this.carritoRepository.create({
            ...createCarritoDto,
            usuarioId,
            estado: carrito_entity_2.EstadoCarrito.ACTIVO
        });
        return this.carritoRepository.save(carrito);
    }
    async findAll() {
        return this.carritoRepository.find({
            relations: ['productos', 'productos.producto']
        });
    }
    async findOne(id) {
        const carrito = await this.carritoRepository.findOne({
            where: { id },
            relations: ['productos', 'productos.producto']
        });
        if (!carrito) {
            throw new common_1.NotFoundException(`Carrito con ID ${id} no encontrado`);
        }
        return carrito;
    }
    async findByUsuario(usuarioId) {
        return this.carritoRepository.find({
            where: { usuarioId },
            relations: ['productos', 'productos.producto'],
            order: { createdAt: 'DESC' }
        });
    }
    async findCarritoActivo(usuarioId) {
        const carrito = await this.carritoRepository.findOne({
            where: { usuarioId, estado: carrito_entity_2.EstadoCarrito.ACTIVO },
            relations: ['productos', 'productos.producto']
        });
        if (!carrito) {
            throw new common_1.NotFoundException('No se encontró un carrito activo para este usuario');
        }
        return carrito;
    }
    async update(id, updateCarritoDto) {
        const carrito = await this.findOne(id);
        Object.assign(carrito, updateCarritoDto);
        return this.carritoRepository.save(carrito);
    }
    async remove(id) {
        const carrito = await this.findOne(id);
        await this.carritoProductoRepository.delete({ carritoId: carrito.id });
        await this.carritoRepository.remove(carrito);
    }
    async getProductosCarrito(carritoId) {
        return await this.carritoProductoRepository.find({
            where: { carritoId },
            relations: ['producto']
        });
    }
    async addProducto(usuarioId, addProductoDto) {
        let carrito;
        try {
            carrito = await this.findCarritoActivo(usuarioId);
        }
        catch (error) {
            carrito = await this.create(usuarioId, {});
            carrito = await this.findCarritoActivo(usuarioId);
        }
        const producto = await this.productosService.findOne(addProductoDto.productoId);
        const productoExistente = await this.carritoProductoRepository.findOne({
            where: { carritoId: carrito.id, productoId: addProductoDto.productoId }
        });
        const cantidadActualEnCarrito = productoExistente ? productoExistente.cantidad : 0;
        const nuevaCantidad = cantidadActualEnCarrito + addProductoDto.cantidad;
        if (producto.stockActual < nuevaCantidad) {
            throw new common_1.BadRequestException(`No hay suficiente stock para el producto "${producto.nombre}". ` +
                `Stock disponible: ${producto.stockActual}, Cantidad solicitada: ${nuevaCantidad} ` +
                `(Ya tienes ${cantidadActualEnCarrito} en el carrito)`);
        }
        if (productoExistente) {
            productoExistente.cantidad += addProductoDto.cantidad;
            await this.carritoProductoRepository.save(productoExistente);
        }
        else {
            const carritoProducto = this.carritoProductoRepository.create({
                carritoId: carrito.id,
                productoId: addProductoDto.productoId,
                cantidad: addProductoDto.cantidad,
                precioUnitario: producto.precioVenta
            });
            await this.carritoProductoRepository.save(carritoProducto);
        }
        return this.findCarritoActivo(usuarioId);
    }
    async removeProducto(usuarioId, productoId) {
        const carrito = await this.findCarritoActivo(usuarioId);
        const result = await this.carritoProductoRepository.delete({
            carritoId: carrito.id,
            productoId: productoId
        });
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Producto con ID ${productoId} no encontrado en el carrito`);
        }
        return this.findCarritoActivo(usuarioId);
    }
    async updateCantidad(usuarioId, productoId, cantidad) {
        console.log(`[DEBUG-SERVICE] updateCantidad llamado: usuario=${usuarioId}, producto=${productoId}, cantidad=${cantidad}`);
        if (!cantidad || cantidad < 1) {
            throw new common_1.BadRequestException('La cantidad debe ser al menos 1');
        }
        const carrito = await this.findCarritoActivo(usuarioId);
        const carritoProducto = await this.carritoProductoRepository.findOne({
            where: { carritoId: carrito.id, productoId: productoId }
        });
        const producto = await this.productosService.findOne(productoId);
        if (producto.stockActual < cantidad) {
            throw new common_1.BadRequestException(`No hay suficiente stock para el producto "${producto.nombre}". ` +
                `Stock disponible: ${producto.stockActual}, Cantidad solicitada: ${cantidad}`);
        }
        carritoProducto.cantidad = cantidad;
        await this.carritoProductoRepository.save(carritoProducto);
        return this.findCarritoActivo(usuarioId);
    }
    async vaciarCarrito(usuarioId) {
        const carrito = await this.findCarritoActivo(usuarioId);
        await this.carritoProductoRepository.delete({ carritoId: carrito.id });
        return this.findCarritoActivo(usuarioId);
    }
    async getResumenCarrito(usuarioId) {
        const carrito = await this.findCarritoActivo(usuarioId);
        let totalItems = 0;
        let totalPrecio = 0;
        carrito.productos.forEach(item => {
            const precio = Number(item.precioUnitario);
            totalItems += item.cantidad;
            totalPrecio += item.cantidad * precio;
        });
        return {
            carritoId: carrito.id,
            estado: carrito.estado,
            totalItems,
            totalPrecio: Math.round(totalPrecio * 100) / 100,
            productos: carrito.productos.map(item => {
                const precio = Number(item.precioUnitario);
                return {
                    productoId: item.productoId,
                    nombre: item.producto?.nombre || 'Producto no disponible',
                    cantidad: item.cantidad,
                    precioUnitario: precio,
                    subtotal: Math.round(item.cantidad * precio * 100) / 100
                };
            })
        };
    }
};
exports.CarritoService = CarritoService;
exports.CarritoService = CarritoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(carrito_entity_1.Carrito)),
    __param(1, (0, typeorm_1.InjectRepository)(carrito_producto_entity_1.CarritoProducto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        productos_service_1.ProductosService])
], CarritoService);
//# sourceMappingURL=carrito.service.js.map