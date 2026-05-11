import { Repository } from 'typeorm';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { ConsultaMedica } from './entities/consulta-medica.entity';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { CreateConsultaMedicaDto } from './dto/create-consulta-medica.dto';
import { PetsService } from '../pets/pets.service';
export declare class HistoriasClinicasService {
    private historiaRepo;
    private consultaRepo;
    private petsService;
    constructor(historiaRepo: Repository<HistoriaClinica>, consultaRepo: Repository<ConsultaMedica>, petsService: PetsService);
    findOrCreateByMascota(mascotaId: number): Promise<HistoriaClinica>;
    findByMascota(mascotaId: number): Promise<HistoriaClinica | null>;
    create(dto: CreateHistoriaClinicaDto): Promise<HistoriaClinica>;
    findAll(): Promise<HistoriaClinica[]>;
    findOne(id: number): Promise<HistoriaClinica>;
    update(id: number, dto: UpdateHistoriaClinicaDto): Promise<HistoriaClinica>;
    remove(id: number): Promise<void>;
    createConsulta(dto: CreateConsultaMedicaDto): Promise<ConsultaMedica>;
    findConsultasByHistoria(historiaId: number): Promise<ConsultaMedica[]>;
    findOneConsulta(id: number): Promise<ConsultaMedica>;
    removeConsulta(id: number): Promise<void>;
}
