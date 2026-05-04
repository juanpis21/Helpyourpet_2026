import { User } from '../../users/entities/user.entity';
import { PerfilVeterinario } from '../../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { Module } from '../../modules/entities/module.entity';
export declare class Role {
    id: number;
    name: string;
    description: string;
    users: User[];
    perfilesVeterinarios: PerfilVeterinario[];
    emergencias: Emergencia[];
    citas: Cita[];
    modules: Module[];
    createdAt: Date;
    updatedAt: Date;
}
