import { Repository } from 'typeorm';
import { Notificacion, TipoNotificacion } from './entities/notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
export declare class NotificacionesService {
    private notificacionesRepository;
    constructor(notificacionesRepository: Repository<Notificacion>);
    enviar(createNotificacionDto: CreateNotificacionDto): Promise<Notificacion>;
    enviarAlertaRapida(usuarioId: number, mensaje: string, tipo?: TipoNotificacion): Promise<Notificacion>;
    findByUsuario(usuarioId: number): Promise<Notificacion[]>;
    findNoLeidasByUsuario(usuarioId: number): Promise<Notificacion[]>;
    marcarComoLeida(id: number, usuarioId: number): Promise<Notificacion>;
    marcarTodasComoLeidas(usuarioId: number): Promise<void>;
    findAll(): Promise<Notificacion[]>;
}
