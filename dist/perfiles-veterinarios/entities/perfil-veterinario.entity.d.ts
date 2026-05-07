import { User } from '../../users/entities/user.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
import { Role } from '../../roles/entities/role.entity';
export declare class PerfilVeterinario {
    id: number;
    especialidad: string;
    matricula: string;
    aniosExperiencia: number;
    universidad?: string;
    telefonoProfesional?: string;
    emailProfesional?: string;
    biografia?: string;
    usuario: User;
    rol: Role;
    veterinariaPrincipal?: Veterinaria;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
