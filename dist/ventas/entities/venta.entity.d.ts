import { User } from '../../users/entities/user.entity';
import { DetalleVenta } from './detalle-venta.entity';
export declare class Venta {
    id: number;
    subtotal: number;
    total: number;
    usuarioId: number;
    usuario: User;
    detalles: DetalleVenta[];
    fecha: Date;
    updatedAt: Date;
}
