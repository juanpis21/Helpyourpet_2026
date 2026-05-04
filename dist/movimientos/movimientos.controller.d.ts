import { MovimientosService } from './movimientos.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
export declare class MovimientosController {
    private readonly movimientosService;
    constructor(movimientosService: MovimientosService);
    create(createMovimientoDto: CreateMovimientoDto): Promise<MovimientoInventario>;
    findAll(): Promise<MovimientoInventario[]>;
    findOne(id: string): Promise<MovimientoInventario>;
    findByProducto(productoId: string): Promise<MovimientoInventario[]>;
    update(id: string, updateMovimientoDto: UpdateMovimientoDto): Promise<MovimientoInventario>;
    remove(id: string): Promise<void>;
}
