import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { CarritoProducto } from './entities/carrito-producto.entity';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { AddProductoDto } from './dto/add-producto.dto';
import { ProductosService } from '../productos/productos.service';
export declare class CarritoService {
    private carritoRepository;
    private carritoProductoRepository;
    private readonly productosService;
    constructor(carritoRepository: Repository<Carrito>, carritoProductoRepository: Repository<CarritoProducto>, productosService: ProductosService);
    create(usuarioId: number, createCarritoDto: CreateCarritoDto): Promise<Carrito>;
    findAll(): Promise<Carrito[]>;
    findOne(id: number): Promise<Carrito>;
    findByUsuario(usuarioId: number): Promise<Carrito[]>;
    findCarritoActivo(usuarioId: number): Promise<Carrito>;
    update(id: number, updateCarritoDto: UpdateCarritoDto): Promise<Carrito>;
    remove(id: number): Promise<void>;
    getProductosCarrito(carritoId: number): Promise<CarritoProducto[]>;
    addProducto(usuarioId: number, addProductoDto: AddProductoDto): Promise<Carrito>;
    removeProducto(usuarioId: number, productoId: number): Promise<Carrito>;
    updateCantidad(usuarioId: number, productoId: number, cantidad: number): Promise<Carrito>;
    vaciarCarrito(usuarioId: number): Promise<Carrito>;
    getResumenCarrito(usuarioId: number): Promise<any>;
}
