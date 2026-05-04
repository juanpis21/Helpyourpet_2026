import { UnidadMedida } from './create-producto.dto';
export declare class UpdateProductoDto {
    nombre?: string;
    descripcion?: string;
    codigoBarras?: string;
    stockActual?: number;
    stockMinimo?: number;
    stockMaximo?: number;
    precioCompra?: number;
    precioVenta?: number;
    fechaVencimiento?: string;
    unidadMedida?: UnidadMedida;
    lote?: string;
    ubicacion?: string;
    isActive?: boolean;
    categoriaId?: number;
    veterinariaId?: number;
    imagen?: string;
}
