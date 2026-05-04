import { VentasService } from './ventas.service';
import { CheckoutDto } from './dto/checkout.dto';
export declare class VentasController {
    private readonly ventasService;
    constructor(ventasService: VentasService);
    checkout(req: any, checkoutDto: CheckoutDto): Promise<import("./entities/venta.entity").Venta>;
    getMisCompras(req: any): Promise<import("./entities/venta.entity").Venta[]>;
    findAll(): Promise<import("./entities/venta.entity").Venta[]>;
    findOne(id: string): Promise<import("./entities/venta.entity").Venta>;
}
