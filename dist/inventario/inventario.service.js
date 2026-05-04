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
exports.InventarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("./entities/producto.entity");
const categoria_entity_1 = require("./entities/categoria.entity");
const movimiento_inventario_entity_1 = require("./entities/movimiento-inventario.entity");
const proveedor_entity_1 = require("./entities/proveedor.entity");
let InventarioService = class InventarioService {
    constructor(productosRepository, categoriasRepository, movimientosRepository, proveedoresRepository) {
        this.productosRepository = productosRepository;
        this.categoriasRepository = categoriasRepository;
        this.movimientosRepository = movimientosRepository;
        this.proveedoresRepository = proveedoresRepository;
    }
    async createProducto(createProductoDto) {
        if (createProductoDto.codigoBarras) {
            const existingProducto = await this.productosRepository.findOne({
                where: { codigoBarras: createProductoDto.codigoBarras },
            });
            if (existingProducto) {
                throw new common_1.ConflictException('Producto with this codigoBarras already exists');
            }
        }
        const productoData = {
            ...createProductoDto,
            fechaVencimiento: createProductoDto.fechaVencimiento
                ? new Date(createProductoDto.fechaVencimiento)
                : undefined
        };
        const producto = this.productosRepository.create(productoData);
        return this.productosRepository.save(producto);
    }
    async findAllProductos() {
        return this.productosRepository.find({
            relations: ['categoria', 'veterinaria'],
            select: ['id', 'nombre', 'descripcion', 'codigoBarras', 'stockActual', 'stockMinimo', 'stockMaximo', 'precioCompra', 'precioVenta', 'fechaVencimiento', 'unidadMedida', 'lote', 'ubicacion', 'isActive', 'createdAt', 'updatedAt', 'categoria', 'veterinaria']
        });
    }
    async findProductoById(id) {
        const producto = await this.productosRepository.findOne({
            where: { id },
            relations: ['categoria', 'veterinaria']
        });
        if (!producto) {
            throw new common_1.NotFoundException(`Producto with ID ${id} not found`);
        }
        return producto;
    }
    async updateProducto(id, updateProductoDto) {
        const producto = await this.findProductoById(id);
        if (updateProductoDto.codigoBarras && updateProductoDto.codigoBarras !== producto.codigoBarras) {
            const existingProducto = await this.productosRepository.findOne({
                where: { codigoBarras: updateProductoDto.codigoBarras },
            });
            if (existingProducto) {
                throw new common_1.ConflictException('Producto with this codigoBarras already exists');
            }
        }
        const updateData = {
            ...updateProductoDto,
            fechaVencimiento: updateProductoDto.fechaVencimiento
                ? new Date(updateProductoDto.fechaVencimiento)
                : undefined
        };
        Object.assign(producto, updateData);
        return this.productosRepository.save(producto);
    }
    async removeProducto(id) {
        const producto = await this.findProductoById(id);
        await this.productosRepository.remove(producto);
    }
    async createCategoria(createCategoriaDto) {
        const existingCategoria = await this.categoriasRepository.findOne({
            where: { codigo: createCategoriaDto.codigo },
        });
        if (existingCategoria) {
            throw new common_1.ConflictException('Categoria with this codigo already exists');
        }
        const categoria = this.categoriasRepository.create(createCategoriaDto);
        return this.categoriasRepository.save(categoria);
    }
    async findAllCategorias() {
        return this.categoriasRepository.find({
            relations: ['productos'],
            select: ['id', 'nombre', 'descripcion', 'codigo', 'color', 'isActive', 'createdAt', 'updatedAt', 'productos']
        });
    }
    async findCategoriaById(id) {
        const categoria = await this.categoriasRepository.findOne({
            where: { id },
            relations: ['productos']
        });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoria with ID ${id} not found`);
        }
        return categoria;
    }
    async updateCategoria(id, updateCategoriaDto) {
        const categoria = await this.findCategoriaById(id);
        if (updateCategoriaDto.codigo && updateCategoriaDto.codigo !== categoria.codigo) {
            const existingCategoria = await this.categoriasRepository.findOne({
                where: { codigo: updateCategoriaDto.codigo },
            });
            if (existingCategoria) {
                throw new common_1.ConflictException('Categoria with this codigo already exists');
            }
        }
        Object.assign(categoria, updateCategoriaDto);
        return this.categoriasRepository.save(categoria);
    }
    async removeCategoria(id) {
        const categoria = await this.findCategoriaById(id);
        await this.categoriasRepository.remove(categoria);
    }
    async createMovimiento(createMovimientoDto) {
        const producto = await this.findProductoById(createMovimientoDto.productoId);
        const stockAnterior = producto.stockActual;
        let stockNuevo = stockAnterior;
        if (createMovimientoDto.tipoMovimiento === 'ENTRADA') {
            stockNuevo = stockAnterior + createMovimientoDto.cantidad;
        }
        else if (createMovimientoDto.tipoMovimiento === 'SALIDA') {
            stockNuevo = stockAnterior - createMovimientoDto.cantidad;
            if (stockNuevo < 0) {
                throw new common_1.ConflictException('Stock insuficiente para esta salida');
            }
        }
        else if (createMovimientoDto.tipoMovimiento === 'AJUSTE') {
            stockNuevo = createMovimientoDto.cantidad;
        }
        const movimiento = this.movimientosRepository.create({
            ...createMovimientoDto,
            stockAnterior,
            stockNuevo,
            producto
        });
        const savedMovimiento = await this.movimientosRepository.save(movimiento);
        producto.stockActual = stockNuevo;
        await this.productosRepository.save(producto);
        return savedMovimiento;
    }
    async findAllMovimientos() {
        return this.movimientosRepository.find({
            relations: ['producto', 'usuario'],
            select: ['id', 'tipoMovimiento', 'cantidad', 'stockAnterior', 'stockNuevo', 'motivo', 'documentoReferencia', 'fechaMovimiento', 'notas', 'producto', 'usuario'],
            order: { fechaMovimiento: 'DESC' }
        });
    }
    async findMovimientoById(id) {
        const movimiento = await this.movimientosRepository.findOne({
            where: { id },
            relations: ['producto', 'usuario']
        });
        if (!movimiento) {
            throw new common_1.NotFoundException(`Movimiento with ID ${id} not found`);
        }
        return movimiento;
    }
    async updateMovimiento(id, updateMovimientoDto) {
        const movimiento = await this.findMovimientoById(id);
        Object.assign(movimiento, updateMovimientoDto);
        return this.movimientosRepository.save(movimiento);
    }
    async removeMovimiento(id) {
        const movimiento = await this.findMovimientoById(id);
        await this.movimientosRepository.remove(movimiento);
    }
    async createProveedor(createProveedorDto) {
        const existingProveedor = await this.proveedoresRepository.findOne({
            where: { rut: createProveedorDto.rut },
        });
        if (existingProveedor) {
            throw new common_1.ConflictException('Proveedor with this RUT already exists');
        }
        const proveedor = this.proveedoresRepository.create(createProveedorDto);
        return this.proveedoresRepository.save(proveedor);
    }
    async findAllProveedores() {
        return this.proveedoresRepository.find({
            select: ['id', 'nombre', 'rut', 'contacto', 'telefono', 'email', 'direccion', 'ciudad', 'pais', 'condicionesPago', 'tiempoEntregaDias', 'notas', 'isActive', 'createdAt', 'updatedAt']
        });
    }
    async findProveedorById(id) {
        const proveedor = await this.proveedoresRepository.findOne({ where: { id } });
        if (!proveedor) {
            throw new common_1.NotFoundException(`Proveedor with ID ${id} not found`);
        }
        return proveedor;
    }
    async updateProveedor(id, updateProveedorDto) {
        const proveedor = await this.findProveedorById(id);
        if (updateProveedorDto.rut && updateProveedorDto.rut !== proveedor.rut) {
            const existingProveedor = await this.proveedoresRepository.findOne({
                where: { rut: updateProveedorDto.rut },
            });
            if (existingProveedor) {
                throw new common_1.ConflictException('Proveedor with this RUT already exists');
            }
        }
        Object.assign(proveedor, updateProveedorDto);
        return this.proveedoresRepository.save(proveedor);
    }
    async removeProveedor(id) {
        const proveedor = await this.findProveedorById(id);
        await this.proveedoresRepository.remove(proveedor);
    }
    async getProductosBajoStock() {
        return this.productosRepository.find({
            where: { isActive: true },
            relations: ['categoria', 'veterinaria'],
            select: ['id', 'nombre', 'stockActual', 'stockMinimo', 'categoria', 'veterinaria']
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
            relations: ['categoria', 'veterinaria'],
            select: ['id', 'nombre', 'fechaVencimiento', 'categoria', 'veterinaria']
        });
    }
    async getMovimientosPorProducto(productoId) {
        return this.movimientosRepository.find({
            where: { producto: { id: productoId } },
            relations: ['producto', 'usuario'],
            order: { fechaMovimiento: 'DESC' }
        });
    }
    async getReporteStockPorCategoria() {
        return this.productosRepository
            .createQueryBuilder('producto')
            .leftJoin('producto.categoria', 'categoria')
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
};
exports.InventarioService = InventarioService;
exports.InventarioService = InventarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(1, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __param(2, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __param(3, (0, typeorm_1.InjectRepository)(proveedor_entity_1.Proveedor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], InventarioService);
//# sourceMappingURL=inventario.service.js.map