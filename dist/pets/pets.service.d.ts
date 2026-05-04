import { Repository } from 'typeorm';
import { Pet } from './entities/pet.entity';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { UsersService } from '../users/users.service';
export declare class PetsService {
    private petsRepository;
    private usersService;
    constructor(petsRepository: Repository<Pet>, usersService: UsersService);
    create(createPetDto: CreatePetDto): Promise<Pet>;
    findAll(): Promise<Pet[]>;
    findOne(id: number): Promise<Pet>;
    findByOwnerId(ownerId: number): Promise<Pet[]>;
    update(id: number, updatePetDto: UpdatePetDto): Promise<Pet>;
    remove(id: number): Promise<void>;
}
