import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
export declare class CategoriasService {
    private categoriasRepository;
    constructor(categoriasRepository: Repository<Categoria>);
    create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria>;
    findAll(): Promise<Categoria[]>;
    findOne(id: number): Promise<Categoria>;
    update(id: number, updateCategoriaDto: UpdateCategoriaDto): Promise<Categoria>;
    remove(id: number): Promise<void>;
}
