import { Repository } from 'typeorm';
import { Calificacion } from './entities/calificacion.entity';
import { CreateCalificacionDto } from './dto/create-calificacion.dto';
import { UpdateCalificacionDto } from './dto/update-calificacion.dto';
import { UsersService } from '../users/users.service';
import { ServiciosService } from '../servicios/servicios.service';
export declare class CalificacionesService {
    private calificacionesRepository;
    private usersService;
    private serviciosService;
    constructor(calificacionesRepository: Repository<Calificacion>, usersService: UsersService, serviciosService: ServiciosService);
    create(usuarioId: number, createCalificacionDto: CreateCalificacionDto): Promise<Calificacion>;
    findAll(): Promise<Calificacion[]>;
    findOne(id: number): Promise<Calificacion>;
    findByServicio(servicioId: number): Promise<Calificacion[]>;
    findByUsuario(usuarioId: number): Promise<Calificacion[]>;
    findByVeterinario(veterinarioId: number): Promise<Calificacion[]>;
    update(id: number, updateCalificacionDto: UpdateCalificacionDto): Promise<Calificacion>;
    remove(id: number): Promise<void>;
    getEstadisticasPorServicio(servicioId: number): Promise<any>;
    getEstadisticasPorVeterinario(veterinarioId: number): Promise<any>;
    getCalificacionesPendientes(): Promise<Calificacion[]>;
}
