import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { Pet } from './entities/pet.entity';
export declare class PetsController {
    private readonly petsService;
    constructor(petsService: PetsService);
    create(req: any, createPetDto: CreatePetDto, file?: Express.Multer.File): Promise<Pet>;
    findAll(): Promise<Pet[]>;
    findByVeterinaria(req: any): Promise<Pet[]>;
    findByOwner(ownerId: string): Promise<Pet[]>;
    findOne(id: string): Promise<Pet>;
    update(id: string, updatePetDto: UpdatePetDto, file?: Express.Multer.File): Promise<Pet>;
    remove(id: string): Promise<void>;
}
