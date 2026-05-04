import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
export declare class UsersService {
    private usersRepository;
    private rolesRepository;
    private permissionsService;
    constructor(usersRepository: Repository<User>, rolesRepository: Repository<Role>, permissionsService: PermissionsService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findByRoles(roleNames: string[]): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByUsername(identifier: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    deactivate(id: number): Promise<void>;
}
