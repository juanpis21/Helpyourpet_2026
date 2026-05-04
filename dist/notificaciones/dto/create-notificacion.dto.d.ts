import { TipoNotificacion } from '../entities/notificacion.entity';
export declare class CreateNotificacionDto {
    usuarioId: number;
    mensaje: string;
    tipo: TipoNotificacion;
}
