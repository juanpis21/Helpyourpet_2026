export declare enum UnidadMedida {
    ML = "ml",
    MG = "mg",
    TABLETAS = "tabletas",
    CAPSULAS = "capsulas",
    UNIDADES = "unidades",
    KG = "kg",
    G = "g",
    L = "l"
}
export declare class CreateProductoDto {
    nombre: string;
    descripcion: string;
    codigoBarras?: string;
    stockActual: number;
    stockMinimo: number;
    stockMaximo?: number;
    precioCompra: number;
    precioVenta: number;
    fechaVencimiento?: string;
    unidadMedida: UnidadMedida;
    lote?: string;
    ubicacion?: string;
    isActive?: boolean;
    categoriaId: number;
    veterinariaId: number;
    imagen?: string;
}
