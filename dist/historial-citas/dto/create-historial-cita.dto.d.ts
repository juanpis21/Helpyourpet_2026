export declare enum TipoCambio {
    CREACION = "CREACION",
    ACTUALIZACION = "ACTUALIZACION",
    CANCELACION = "CANCELACION",
    COMPLETACION = "COMPLETACION"
}
export declare class CreateHistorialCitaDto {
    citaId: number;
    tipoCambio: TipoCambio;
    descripcion: string;
    valorAnterior?: string;
    valorNuevo?: string;
    usuarioId: number;
}
