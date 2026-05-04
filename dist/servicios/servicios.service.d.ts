import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { VeterinariasService } from '../veterinarias/veterinarias.service';
export declare class ServiciosService {
    private serviciosRepository;
    private veterinariasService;
    constructor(serviciosRepository: Repository<Servicio>, veterinariasService: VeterinariasService);
    create(createServicioDto: CreateServicioDto): Promise<Servicio>;
    findAll(): Promise<Servicio[]>;
    findOne(id: number): Promise<Servicio>;
    update(id: number, updateServicioDto: UpdateServicioDto): Promise<Servicio>;
    remove(id: number): Promise<void>;
    findByVeterinaria(veterinariaId: number): Promise<Servicio[]>;
    findByTipo(tipoServicio: string): Promise<Servicio[]>;
    searchServicios(query: string): Promise<Servicio[]>;
    getReporteServiciosPorVeterinaria(): Promise<any[]>;
    getServiciosPorTipo(): Promise<any[]>;
}
