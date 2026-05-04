import { Repository } from 'typeorm';
import { Emergencia } from './entities/emergencia.entity';
import { CreateEmergenciaDto } from './dto/create-emergencia.dto';
import { UpdateEmergenciaDto } from './dto/update-emergencia.dto';
import { PetsService } from '../pets/pets.service';
import { RolesService } from '../roles/roles.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';
export declare class EmergenciasService {
    private emergenciasRepository;
    private petsService;
    private rolesService;
    private veterinariasService;
    constructor(emergenciasRepository: Repository<Emergencia>, petsService: PetsService, rolesService: RolesService, veterinariasService: VeterinariasService);
    create(createEmergenciaDto: CreateEmergenciaDto): Promise<Emergencia>;
    findAll(): Promise<Emergencia[]>;
    findOne(id: number): Promise<Emergencia>;
    findByMascota(mascotaId: number): Promise<Emergencia[]>;
    findByVeterinario(veterinarioId: number): Promise<Emergencia[]>;
    findByVeterinaria(veterinariaId: number): Promise<Emergencia[]>;
    findByTipo(tipo: string): Promise<Emergencia[]>;
    findByFecha(fecha: string): Promise<Emergencia[]>;
    update(id: number, updateEmergenciaDto: UpdateEmergenciaDto): Promise<Emergencia>;
    remove(id: number): Promise<void>;
}
