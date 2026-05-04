export declare enum CitaEstado {
    PROGRAMADA = "Programada",
    EN_CURSO = "En curso",
    COMPLETADA = "Completada",
    CANCELADA = "Cancelada"
}
export declare class CreateCitaDto {
    motivo: string;
    fechaHora: string;
    estado?: CitaEstado;
    notas?: string;
    usuarioId: number;
    idVeterinario?: number;
    mascotaId: number;
    isActive?: boolean;
}
