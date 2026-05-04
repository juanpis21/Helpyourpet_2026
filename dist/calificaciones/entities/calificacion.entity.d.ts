import { User } from '../../users/entities/user.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';
export declare class Calificacion {
    id: number;
    puntuacion: number;
    comentario?: string;
    estado: string;
    usuarioId: number;
    usuario: User;
    servicioId: number;
    servicio: Servicio;
    veterinarioId?: number;
    veterinario?: User;
    fecha: Date;
}
