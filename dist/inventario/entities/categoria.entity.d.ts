import { Producto } from './producto.entity';
export declare class Categoria {
    id: number;
    nombre: string;
    descripcion?: string;
    codigo: string;
    color?: string;
    isActive: boolean;
    productos: Producto[];
    createdAt: Date;
    updatedAt: Date;
}
