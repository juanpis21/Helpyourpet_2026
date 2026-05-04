import { Repository } from 'typeorm';
import { ReporteMaltrato } from './entities/reporte-maltrato.entity';
import { CreateReporteMaltratoDto } from './dto/create-reporte-maltrato.dto';
import { UpdateReporteMaltratoDto } from './dto/update-reporte-maltrato.dto';
import { PetsService } from '../pets/pets.service';
export declare class ReportesMaltratoService {
    private reportesRepository;
    private petsService;
    constructor(reportesRepository: Repository<ReporteMaltrato>, petsService: PetsService);
    create(createDto: CreateReporteMaltratoDto, usuarioId: number): Promise<ReporteMaltrato>;
    findAll(): Promise<ReporteMaltrato[]>;
    findByUsuario(usuarioId: number): Promise<ReporteMaltrato[]>;
    findOne(id: number): Promise<ReporteMaltrato>;
    updateEstado(id: number, updateDto: UpdateReporteMaltratoDto): Promise<ReporteMaltrato>;
    remove(id: number): Promise<void>;
}
