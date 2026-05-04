import { Carrito } from './carrito.entity';
import { Producto } from '../../productos/entities/producto.entity';
export declare class CarritoProducto {
    id: number;
    cantidad: number;
    precioUnitario: number;
    carritoId: number;
    carrito: Carrito;
    productoId: number;
    producto: Producto;
}
