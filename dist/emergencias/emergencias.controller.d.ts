import { EmergenciasService } from './emergencias.service';
import { CreateEmergenciaDto } from './dto/create-emergencia.dto';
import { UpdateEmergenciaDto } from './dto/update-emergencia.dto';
import { Emergencia } from './entities/emergencia.entity';
export declare class EmergenciasController {
    private readonly emergenciasService;
    constructor(emergenciasService: EmergenciasService);
    create(createEmergenciaDto: CreateEmergenciaDto): Promise<Emergencia>;
    findAll(): Promise<Emergencia[]>;
    findByMascota(mascotaId: string): Promise<Emergencia[]>;
    findByVeterinario(veterinarioId: string): Promise<Emergencia[]>;
    findByVeterinaria(veterinariaId: string): Promise<Emergencia[]>;
    findByTipo(tipo: string): Promise<Emergencia[]>;
    findByFecha(fecha: string): Promise<Emergencia[]>;
    findOne(id: string): Promise<Emergencia>;
    update(id: string, updateEmergenciaDto: UpdateEmergenciaDto): Promise<Emergencia>;
    remove(id: string): Promise<void>;
}
