import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
export declare class NotificacionesController {
    private readonly notificacionesService;
    constructor(notificacionesService: NotificacionesService);
    getMisNotificaciones(req: any): Promise<import("./entities/notificacion.entity").Notificacion[]>;
    getNoLeidas(req: any): Promise<import("./entities/notificacion.entity").Notificacion[]>;
    marcarTodasLeidas(req: any): Promise<{
        statusCode: number;
        message: string;
    }>;
    marcarComoLeida(req: any, id: string): Promise<import("./entities/notificacion.entity").Notificacion>;
    create(createNotificacionDto: CreateNotificacionDto): Promise<import("./entities/notificacion.entity").Notificacion>;
    findAll(): Promise<import("./entities/notificacion.entity").Notificacion[]>;
}
