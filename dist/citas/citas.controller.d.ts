import { CitasService } from './citas.service';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { Cita } from './entities/cita.entity';
export declare class CitasController {
    private readonly citasService;
    constructor(citasService: CitasService);
    create(createCitaDto: CreateCitaDto): Promise<Cita>;
    findAll(): Promise<Cita[]>;
    findByUsuario(usuarioId: string): Promise<Cita[]>;
    findByMascota(mascotaId: string): Promise<Cita[]>;
    findByEstado(estado: string): Promise<Cita[]>;
    findByFecha(fecha: string): Promise<Cita[]>;
    findOne(id: string): Promise<Cita>;
    update(id: string, updateCitaDto: UpdateCitaDto): Promise<Cita>;
    remove(id: string): Promise<void>;
}
