import { HistoriasClinicasService } from './historias-clinicas.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
export declare class HistoriasClinicasController {
    private readonly historiasClinicasService;
    constructor(historiasClinicasService: HistoriasClinicasService);
    create(createDto: CreateHistoriaClinicaDto): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    findAll(): Promise<import("./entities/historia-clinica.entity").HistoriaClinica[]>;
    findByMascota(mascotaId: string): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    findOne(id: string): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    update(id: string, updateDto: UpdateHistoriaClinicaDto): Promise<import("./entities/historia-clinica.entity").HistoriaClinica>;
    remove(id: string): Promise<void>;
}
