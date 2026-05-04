import { Repository } from 'typeorm';
import { Evento } from './entities/evento.entity';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { VeterinariasService } from '../veterinarias/veterinarias.service';
export declare class EventosService {
    private eventosRepository;
    private veterinariasService;
    constructor(eventosRepository: Repository<Evento>, veterinariasService: VeterinariasService);
    create(createEventoDto: CreateEventoDto): Promise<Evento>;
    findAll(): Promise<Evento[]>;
    findActive(): Promise<Evento[]>;
    findOne(id: number): Promise<Evento>;
    findByVeterinaria(veterinariaId: number): Promise<Evento[]>;
    update(id: number, updateEventoDto: UpdateEventoDto): Promise<Evento>;
    remove(id: number): Promise<void>;
}
