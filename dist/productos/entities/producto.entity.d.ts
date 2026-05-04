import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
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
    imagen?: string;
    categoriaId: number;
    veterinariaId: number;
    veterinaria: Veterinaria;
    createdAt: Date;
    updatedAt: Date;
}
