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
exports.MovimientosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movimiento_inventario_entity_1 = require("./entities/movimiento-inventario.entity");
const productos_service_1 = require("../productos/productos.service");
const users_service_1 = require("../users/users.service");
let MovimientosService = class MovimientosService {
    constructor(movimientosRepository, productosService, usersService) {
        this.movimientosRepository = movimientosRepository;
        this.productosService = productosService;
        this.usersService = usersService;
    }
    async create(createMovimientoDto) {
        const producto = await this.productosService.findOne(createMovimientoDto.productoId);
        await this.usersService.findOne(createMovimientoDto.usuarioId);
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
            productoId: createMovimientoDto.productoId,
            tipoMovimiento: createMovimientoDto.tipoMovimiento,
            cantidad: createMovimientoDto.cantidad,
            stockAnterior,
            stockNuevo,
            motivo: createMovimientoDto.motivo,
            documentoReferencia: createMovimientoDto.documentoReferencia,
            usuarioId: createMovimientoDto.usuarioId,
            notas: createMovimientoDto.notas
        });
        const savedMovimiento = await this.movimientosRepository.save(movimiento);
        producto.stockActual = stockNuevo;
        await this.productosService.update(producto.id, { stockActual: stockNuevo });
        return savedMovimiento;
    }
    async findAll() {
        return this.movimientosRepository.find({
            relations: ['usuario'],
            select: ['id', 'tipoMovimiento', 'cantidad', 'stockAnterior', 'stockNuevo', 'motivo', 'documentoReferencia', 'fechaMovimiento', 'notas', 'productoId', 'usuarioId', 'usuario'],
            order: { fechaMovimiento: 'DESC' }
        });
    }
    async findOne(id) {
        const movimiento = await this.movimientosRepository.findOne({
            where: { id },
            relations: ['usuario']
        });
        if (!movimiento) {
            throw new common_1.NotFoundException(`Movimiento with ID ${id} not found`);
        }
        return movimiento;
    }
    async update(id, updateMovimientoDto) {
        const movimiento = await this.findOne(id);
        Object.assign(movimiento, updateMovimientoDto);
        return this.movimientosRepository.save(movimiento);
    }
    async remove(id) {
        const movimiento = await this.findOne(id);
        await this.movimientosRepository.remove(movimiento);
    }
    async findByProducto(productoId) {
        return this.movimientosRepository.find({
            where: { productoId: productoId },
            relations: ['usuario'],
            order: { fechaMovimiento: 'DESC' }
        });
    }
};
exports.MovimientosService = MovimientosService;
exports.MovimientosService = MovimientosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => productos_service_1.ProductosService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        productos_service_1.ProductosService,
        users_service_1.UsersService])
], MovimientosService);
//# sourceMappingURL=movimientos.service.js.map