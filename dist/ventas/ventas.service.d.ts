import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CarritoService } from '../carrito/carrito.service';
import { CheckoutDto } from './dto/checkout.dto';
export declare class VentasService {
    private ventaRepository;
    private readonly carritoService;
    private dataSource;
    constructor(ventaRepository: Repository<Venta>, carritoService: CarritoService, dataSource: DataSource);
    checkout(usuarioId: number, checkoutDto: CheckoutDto): Promise<Venta>;
    findAll(): Promise<Venta[]>;
    findByUsuario(usuarioId: number): Promise<Venta[]>;
    findOne(id: number): Promise<Venta>;
}
