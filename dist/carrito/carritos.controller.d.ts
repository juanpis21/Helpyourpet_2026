import { CarritoService } from './carrito.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { Carrito } from './entities/carrito.entity';
export declare class CarritosController {
    private readonly carritoService;
    constructor(carritoService: CarritoService);
    getMiCarrito(req: any): Promise<Carrito>;
    getMisCarritos(req: any): Promise<Carrito[]>;
    getResumen(req: any): Promise<any>;
    findAll(): Promise<Carrito[]>;
    create(req: any, createCarritoDto: CreateCarritoDto): Promise<Carrito>;
    findOne(id: string): Promise<Carrito>;
    update(id: string, updateCarritoDto: UpdateCarritoDto): Promise<Carrito>;
    remove(id: string): Promise<void>;
}
