import { Repository } from 'typeorm';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { PetsService } from '../pets/pets.service';
import { RolesService } from '../roles/roles.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';
import { UsersService } from '../users/users.service';
export declare class HistoriasClinicasService {
    private historiaClinicaRepository;
    private petsService;
    private rolesService;
    private veterinariasService;
    private usersService;
    constructor(historiaClinicaRepository: Repository<HistoriaClinica>, petsService: PetsService, rolesService: RolesService, veterinariasService: VeterinariasService, usersService: UsersService);
    create(createDto: CreateHistoriaClinicaDto): Promise<HistoriaClinica>;
    findAll(): Promise<HistoriaClinica[]>;
    findOne(id: number): Promise<HistoriaClinica>;
    findByMascota(mascotaId: number): Promise<HistoriaClinica>;
    update(id: number, updateDto: UpdateHistoriaClinicaDto): Promise<HistoriaClinica>;
    remove(id: number): Promise<void>;
}
