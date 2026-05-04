import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
import { Categoria } from './categoria.entity';
import { MovimientoInventario } from './movimiento-inventario.entity';
export declare class Producto {
    id: number;
    nombre: string;
    descripcion: string;
    codigoBarras?: string;
    stockActual: number;
    stockMinimo: number;
    stockMaximo?: number;
    precioCompra: number;
    precioVenta: number;
    fechaVencimiento?: Date;
    unidadMedida: string;
    lote?: string;
    ubicacion?: string;
    isActive: boolean;
    categoria: Categoria;
    veterinaria: Veterinaria;
    movimientos: MovimientoInventario[];
    createdAt: Date;
    updatedAt: Date;
}
