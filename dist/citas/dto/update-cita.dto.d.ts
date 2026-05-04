import { CitaEstado } from './create-cita.dto';
export declare class UpdateCitaDto {
    motivo?: string;
    fechaHora?: string;
    estado?: CitaEstado;
    notas?: string;
    usuarioId?: number;
    idVeterinario?: number;
    mascotaId?: number;
    idHistoriaClinica?: number;
    isActive?: boolean;
}
