import { User } from '../../users/entities/user.entity';
import { CarritoProducto } from './carrito-producto.entity';
export declare enum EstadoCarrito {
    ACTIVO = "ACTIVO",
    COMPRADO = "COMPRADO",
    CANCELADO = "CANCELADO"
}
export declare class Carrito {
    id: number;
    estado: EstadoCarrito;
    usuarioId: number;
    usuario: User;
    productos: CarritoProducto[];
    createdAt: Date;
    updatedAt: Date;
}
