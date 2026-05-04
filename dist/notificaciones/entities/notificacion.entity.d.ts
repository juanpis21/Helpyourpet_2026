import { User } from '../../users/entities/user.entity';
export declare enum EstadoNotificacion {
    LEIDO = "LEIDO",
    NO_LEIDO = "NO_LEIDO"
}
export declare enum TipoNotificacion {
    INFO = "INFO",
    ALERTA = "ALERTA",
    EXITO = "EXITO",
    ERROR = "ERROR"
}
export declare class Notificacion {
    id: number;
    mensaje: string;
    tipo: TipoNotificacion;
    estado: EstadoNotificacion;
    usuarioId: number;
    usuario: User;
    fecha: Date;
}
