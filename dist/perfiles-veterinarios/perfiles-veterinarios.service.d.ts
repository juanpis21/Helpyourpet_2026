import { Repository } from 'typeorm';
import { PerfilVeterinario } from './entities/perfil-veterinario.entity';
import { CreatePerfilVeterinarioDto } from './dto/create-perfil-veterinario.dto';
import { UpdatePerfilVeterinarioDto } from './dto/update-perfil-veterinario.dto';
import { UsersService } from '../users/users.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';
export declare class PerfilesVeterinariosService {
    private perfilesVeterinariosRepository;
    private usersService;
    private veterinariasService;
    constructor(perfilesVeterinariosRepository: Repository<PerfilVeterinario>, usersService: UsersService, veterinariasService: VeterinariasService);
    create(createPerfilVeterinarioDto: CreatePerfilVeterinarioDto): Promise<PerfilVeterinario>;
    findAll(): Promise<PerfilVeterinario[]>;
    findOne(id: number): Promise<PerfilVeterinario>;
    findByUsuario(usuarioId: number): Promise<PerfilVeterinario[]>;
    findByVeterinaria(veterinariaId: number): Promise<PerfilVeterinario[]>;
    findByEspecialidad(especialidad: string): Promise<PerfilVeterinario[]>;
    update(id: number, updatePerfilVeterinarioDto: UpdatePerfilVeterinarioDto): Promise<PerfilVeterinario>;
    remove(id: number): Promise<void>;
}
