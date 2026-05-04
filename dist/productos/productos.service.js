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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("./entities/producto.entity");
const categorias_service_1 = require("../categorias/categorias.service");
const veterinarias_service_1 = require("../veterinarias/veterinarias.service");
let ProductosService = class ProductosService {
    constructor(productosRepository, categoriasService, veterinariasService) {
        this.productosRepository = productosRepository;
        this.categoriasService = categoriasService;
        this.veterinariasService = veterinariasService;
    }
    async create(createProductoDto) {
        if (createProductoDto.codigoBarras) {
            const existingProducto = await this.productosRepository.findOne({
                where: { codigoBarras: createProductoDto.codigoBarras },
            });
            if (existingProducto) {
                throw new common_1.ConflictException('Producto with this codigoBarras already exists');
            }
        }
        await this.categoriasService.findOne(createProductoDto.categoriaId);
        await this.veterinariasService.findOne(createProductoDto.veterinariaId);
        const productoData = {
            ...createProductoDto,
            fechaVencimiento: createProductoDto.fechaVencimiento
                ? new Date(createProductoDto.fechaVencimiento)
                : undefined
        };
        const producto = this.productosRepository.create(productoData);
        return this.productosRepository.save(producto);
    }
    async findAll() {
        return this.productosRepository.find({
            relations: ['veterinaria'],
            select: ['id', 'nombre', 'descripcion', 'codigoBarras', 'stockActual', 'stockMinimo', 'stockMaximo', 'precioCompra', 'precioVenta', 'fechaVencimiento', 'unidadMedida', 'lote', 'ubicacion', 'isActive', 'createdAt', 'updatedAt', 'categoriaId', 'veterinariaId', 'veterinaria']
        });
    }
    async findOne(id) {
        const producto = await this.productosRepository.findOne({
            where: { id },
            relations: ['veterinaria']
        });
        if (!producto) {
            throw new common_1.NotFoundException(`Producto with ID ${id} not found`);
        }
        return producto;
    }
    async update(id, updateProductoDto) {
        const producto = await this.findOne(id);
        if (updateProductoDto.codigoBarras && updateProductoDto.codigoBarras !== producto.codigoBarras) {
            const existingProducto = await this.productosRepository.findOne({
                where: { codigoBarras: updateProductoDto.codigoBarras },
            });
            if (existingProducto) {
                throw new common_1.ConflictException('Producto with this codigoBarras already exists');
            }
        }
        if (updateProductoDto.categoriaId) {
            await this.categoriasService.findOne(updateProductoDto.categoriaId);
        }
        if (updateProductoDto.veterinariaId) {
            await this.veterinariasService.findOne(updateProductoDto.veterinariaId);
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
    async remove(id) {
        const producto = await this.findOne(id);
        await this.productosRepository.remove(producto);
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        categorias_service_1.CategoriasService,
        veterinarias_service_1.VeterinariasService])
], ProductosService);
//# sourceMappingURL=productos.service.js.map