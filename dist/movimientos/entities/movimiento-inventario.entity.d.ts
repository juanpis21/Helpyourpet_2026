import { User } from '../../users/entities/user.entity';
export declare class MovimientoInventario {
    id: number;
    productoId: number;
    tipoMovimiento: string;
    cantidad: number;
    stockAnterior: number;
    stockNuevo: number;
    motivo: string;
    documentoReferencia?: string;
    usuarioId: number;
    usuario: User;
    notas?: string;
    fechaMovimiento: Date;
}
