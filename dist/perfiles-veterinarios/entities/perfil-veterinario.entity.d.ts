import { User } from '../../users/entities/user.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
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
    veterinariaPrincipal?: Veterinaria;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
