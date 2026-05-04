import { CalificacionesService } from './calificaciones.service';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { Calificacion } from './entities/calificacion.entity';
export declare class CalificacionesController {
    private readonly calificacionesService;
    constructor(calificacionesService: CalificacionesService);
    create(createCalificacionDto: CreateCalificacionDto, req: any): Promise<Calificacion>;
    findAll(): Promise<Calificacion[]>;
    findOne(id: string): Promise<Calificacion>;
    findByServicio(servicioId: string): Promise<Calificacion[]>;
    findByUsuario(usuarioId: string): Promise<Calificacion[]>;
    findByVeterinario(veterinarioId: string): Promise<Calificacion[]>;
    findMisCalificaciones(req: any): Promise<Calificacion[]>;
    getCalificacionesPendientes(): Promise<Calificacion[]>;
    update(id: string, updateCalificacionDto: UpdateCalificacionDto): Promise<Calificacion>;
    remove(id: string): Promise<void>;
    getEstadisticasPorServicio(servicioId: string): Promise<any>;
    getEstadisticasPorVeterinario(veterinarioId: string): Promise<any>;
}
