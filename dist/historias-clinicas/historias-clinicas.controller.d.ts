import { HistoriasClinicasService } from './historias-clinicas.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { CreateConsultaMedicaDto } from './dto/create-consulta-medica.dto';
export declare class HistoriasClinicasController {
    private readonly service;
    constructor(service: HistoriasClinicasService);
    create(dto: CreateHistoriaClinicaDto): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    findAll(): Promise<import("./entities/historia-clinica.entity").HistoriaClinica[]>;
    findOrCreateByMascota(mascotaId: string): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    findOne(id: string): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    update(id: string, dto: UpdateHistoriaClinicaDto): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    remove(id: string): Promise<void>;
    createConsulta(dto: CreateConsultaMedicaDto): Promise<import("./entities/consulta-medica.entity").ConsultaMedica>;
    getConsultas(historiaId: string): Promise<import("./entities/consulta-medica.entity").ConsultaMedica[]>;
    removeConsulta(id: string): Promise<void>;
}
