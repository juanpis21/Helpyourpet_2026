import { CarritoService } from './carrito.service';
import { AddProductoDto } from './dto/add-producto.dto';
import { UpdateCantidadDto } from './dto/update-cantidad.dto';
import { CarritoProducto } from './entities/carrito-producto.entity';
export declare class CarritoProductosController {
    private readonly carritoService;
    constructor(carritoService: CarritoService);
    getProductosMiCarrito(req: any): Promise<CarritoProducto[]>;
    addProducto(req: any, addProductoDto: AddProductoDto): Promise<import("./entities/carrito.entity").Carrito>;
    vaciarCarrito(req: any): Promise<import("./entities/carrito.entity").Carrito>;
    updateCantidad(req: any, productoId: string, updateCantidadDto: UpdateCantidadDto): Promise<import("./entities/carrito.entity").Carrito>;
    removeProducto(req: any, productoId: string): Promise<import("./entities/carrito.entity").Carrito>;
}
