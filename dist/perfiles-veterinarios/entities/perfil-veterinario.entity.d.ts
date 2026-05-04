import { User } from '../../users/entities/user.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
import { Cita } from '../../citas/entities/cita.entity';
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
    citas: Cita[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
