import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Servicio } from './entities/servicio.entity';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(createServicioDto: CreateServicioDto, file?: Express.Multer.File): Promise<Servicio>;
    findAll(): Promise<Servicio[]>;
    findOne(id: string): Promise<Servicio>;
    update(id: string, updateServicioDto: UpdateServicioDto, file?: Express.Multer.File): Promise<Servicio>;
    remove(id: string): Promise<void>;
}
