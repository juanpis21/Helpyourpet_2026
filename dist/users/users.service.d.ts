import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserByVetDto } from './dto/register-user-by-vet.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { PerfilVeterinario } from '../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { PermissionsService } from '../permissions/permissions.service';
export declare class UsersService {
    private usersRepository;
    private rolesRepository;
    private perfilesRepository;
    private permissionsService;
    constructor(usersRepository: Repository<User>, rolesRepository: Repository<Role>, perfilesRepository: Repository<PerfilVeterinario>, permissionsService: PermissionsService);
    create(createUserDto: CreateUserDto): Promise<User>;
    registerByVeterinario(registerDto: RegisterUserByVetDto, createdById: number): Promise<User>;
    findUsuariosByVeterinario(createdById: number): Promise<User[]>;
    findUsuariosByVeterinaria(veterinarioId: number): Promise<User[]>;
    findAll(): Promise<User[]>;
    findByRoles(roleNames: string[]): Promise<User[]>;
    findOne(id: number): Promise<User>;
    findByUsername(identifier: string): Promise<User>;
    findByEmail(email: string): Promise<User>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<User>;
    deactivate(id: number): Promise<void>;
}
