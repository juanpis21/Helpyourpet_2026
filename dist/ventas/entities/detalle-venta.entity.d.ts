import { Venta } from './venta.entity';
import { Producto } from '../../productos/entities/producto.entity';
export declare class DetalleVenta {
    id: number;
    cantidad: number;
    precioUnitario: number;
    ventaId: number;
    venta: Venta;
    productoId: number;
    producto: Producto;
}
