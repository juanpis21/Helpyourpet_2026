export declare enum EstadoCalificacion {
    PENDIENTE = "PENDIENTE",
    APROBADA = "APROBADA",
    RECHAZADA = "RECHAZADA"
}
export declare class CreateCalificacionDto {
    puntuacion: number;
    comentario?: string;
    usuarioId?: number;
    servicioId: number;
    veterinarioId?: number;
    estado?: EstadoCalificacion;
}
