import { Repository } from 'typeorm';
import { Veterinaria } from './entities/veterinaria.entity';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
export declare class VeterinariasService {
    private veterinariasRepository;
    constructor(veterinariasRepository: Repository<Veterinaria>);
    create(createVeterinariaDto: CreateVeterinariaDto): Promise<Veterinaria>;
    findAll(): Promise<Veterinaria[]>;
    findOne(id: number): Promise<Veterinaria>;
    update(id: number, updateVeterinariaDto: UpdateVeterinariaDto): Promise<Veterinaria>;
    remove(id: number): Promise<void>;
}
