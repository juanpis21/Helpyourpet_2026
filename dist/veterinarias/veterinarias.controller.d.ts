import { VeterinariasService } from './veterinarias.service';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { Veterinaria } from './entities/veterinaria.entity';
export declare class VeterinariasController {
    private readonly veterinariasService;
    constructor(veterinariasService: VeterinariasService);
    create(createVeterinariaDto: CreateVeterinariaDto): Promise<Veterinaria>;
    findAll(): Promise<Veterinaria[]>;
    findOne(id: string): Promise<Veterinaria>;
    update(id: string, updateVeterinariaDto: UpdateVeterinariaDto): Promise<Veterinaria>;
    remove(id: string): Promise<void>;
}
