import { ReportesMaltratoService } from './reportes-maltrato.service';
import { CreateReporteMaltratoDto } from './dto/create-reporte-maltrato.dto';
import { UpdateReporteMaltratoDto } from './dto/update-reporte-maltrato.dto';
export declare class ReportesMaltratoController {
    private readonly reportesService;
    constructor(reportesService: ReportesMaltratoService);
    create(req: any, createDto: CreateReporteMaltratoDto): Promise<import("./entities/reporte-maltrato.entity").ReporteMaltrato>;
    findMisReportes(req: any): Promise<import("./entities/reporte-maltrato.entity").ReporteMaltrato[]>;
    findAll(): Promise<import("./entities/reporte-maltrato.entity").ReporteMaltrato[]>;
    findOne(id: string): Promise<import("./entities/reporte-maltrato.entity").ReporteMaltrato>;
    updateEstado(id: string, updateDto: UpdateReporteMaltratoDto): Promise<import("./entities/reporte-maltrato.entity").ReporteMaltrato>;
    remove(id: string): Promise<void>;
}
