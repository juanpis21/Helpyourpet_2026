import { Producto } from './producto.entity';
import { User } from '../../users/entities/user.entity';
export declare class MovimientoInventario {
    id: number;
    producto: Producto;
    tipoMovimiento: string;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    motivo: string;
    documentoReferencia?: string;
    usuario: User;
    notas?: string;
    fechaMovimiento: Date;
}
