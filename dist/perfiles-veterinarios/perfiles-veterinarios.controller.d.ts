import { PerfilesVeterinariosService } from './perfiles-veterinarios.service';
import { CreatePerfilVeterinarioDto } from './dto/create-perfil-veterinario.dto';
import { UpdatePerfilVeterinarioDto } from './dto/update-perfil-veterinario.dto';
import { PerfilVeterinario } from './entities/perfil-veterinario.entity';
export declare class PerfilesVeterinariosController {
    private readonly perfilesVeterinariosService;
    constructor(perfilesVeterinariosService: PerfilesVeterinariosService);
    create(createPerfilVeterinarioDto: CreatePerfilVeterinarioDto): Promise<PerfilVeterinario>;
    findAll(): Promise<PerfilVeterinario[]>;
    findByUsuario(usuarioId: string): Promise<PerfilVeterinario[]>;
    findByVeterinaria(veterinariaId: string): Promise<PerfilVeterinario[]>;
    findByEspecialidad(especialidad: string): Promise<PerfilVeterinario[]>;
    findOne(id: string): Promise<PerfilVeterinario>;
    update(id: string, updatePerfilVeterinarioDto: UpdatePerfilVeterinarioDto): Promise<PerfilVeterinario>;
    remove(id: string): Promise<void>;
}
