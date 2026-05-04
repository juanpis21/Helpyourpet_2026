import { Repository } from 'typeorm';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { ProductosService } from '../productos/productos.service';
import { UsersService } from '../users/users.service';
export declare class MovimientosService {
    private movimientosRepository;
    private productosService;
    private usersService;
    constructor(movimientosRepository: Repository<MovimientoInventario>, productosService: ProductosService, usersService: UsersService);
    create(createMovimientoDto: CreateMovimientoDto): Promise<MovimientoInventario>;
    findAll(): Promise<MovimientoInventario[]>;
    findOne(id: number): Promise<MovimientoInventario>;
    update(id: number, updateMovimientoDto: UpdateMovimientoDto): Promise<MovimientoInventario>;
    remove(id: number): Promise<void>;
    findByProducto(productoId: number): Promise<MovimientoInventario[]>;
}
