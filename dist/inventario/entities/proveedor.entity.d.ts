import { MovimientoInventario } from './movimiento-inventario.entity';
export declare class Proveedor {
    id: number;
    nombre: string;
    rut: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
    condicionesPago?: string;
    tiempoEntregaDias?: number;
    notas?: string;
    isActive: boolean;
    movimientos: MovimientoInventario[];
    createdAt: Date;
    updatedAt: Date;
}
