import { Repository } from 'typeorm';
import { Publicacion } from './entities/publicacion.entity';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { UsersService } from '../users/users.service';
export declare class PublicacionesService {
    private readonly publicacionesRepository;
    private readonly usersService;
    constructor(publicacionesRepository: Repository<Publicacion>, usersService: UsersService);
    create(createPublicacionDto: CreatePublicacionDto): Promise<Publicacion>;
    findAll(): Promise<Publicacion[]>;
    findByAutor(autorId: number): Promise<Publicacion[]>;
    findOne(id: number): Promise<Publicacion>;
    update(id: number, updatePublicacionDto: UpdatePublicacionDto): Promise<Publicacion>;
    remove(id: number): Promise<void>;
}
