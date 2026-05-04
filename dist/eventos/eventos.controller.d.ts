import { EventosService } from './eventos.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
export declare class EventosController {
    private readonly eventosService;
    constructor(eventosService: EventosService);
    create(createEventoDto: CreateEventoDto): Promise<import("./entities/evento.entity").Evento>;
    findAll(): Promise<import("./entities/evento.entity").Evento[]>;
    findActive(): Promise<import("./entities/evento.entity").Evento[]>;
    findByVeterinaria(id: string): Promise<import("./entities/evento.entity").Evento[]>;
    findOne(id: string): Promise<import("./entities/evento.entity").Evento>;
    update(id: string, updateEventoDto: UpdateEventoDto): Promise<import("./entities/evento.entity").Evento>;
    remove(id: string): Promise<void>;
}
