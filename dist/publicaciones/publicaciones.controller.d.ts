import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Publicacion } from './entities/publicacion.entity';
export declare class PublicacionesController {
    private readonly publicacionesService;
    constructor(publicacionesService: PublicacionesService);
    create(req: any, createPublicacionDto: CreatePublicacionDto, file?: Express.Multer.File): Promise<Publicacion>;
    findAll(): Promise<Publicacion[]>;
    findByAutor(autorId: string): Promise<Publicacion[]>;
    findOne(id: string): Promise<Publicacion>;
    update(id: string, updatePublicacionDto: UpdatePublicacionDto): Promise<Publicacion>;
    remove(id: string): Promise<void>;
}
