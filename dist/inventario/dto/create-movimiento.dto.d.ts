export declare enum TipoMovimiento {
    ENTRADA = "ENTRADA",
    SALIDA = "SALIDA",
    AJUSTE = "AJUSTE",
    DEVOLUCION = "DEVOLUCION"
}
export declare class CreateMovimientoDto {
    productoId: number;
    tipoMovimiento: TipoMovimiento;
    cantidad: number;
    motivo: string;
    documentoReferencia?: string;
    usuarioId: number;
    notas?: string;
}
