import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../roles/entities/role.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
import { User } from '../../users/entities/user.entity';
export declare class HistoriaClinica {
    id: number;
    diagnostico: string;
    tratamiento: string;
    fecha: Date;
    createdAt: Date;
    mascotaId: number;
    mascota: Pet;
    veterinarioId: number;
    veterinario: Role;
    veterinariaId: number;
    veterinaria: Veterinaria;
    usuarioId: number;
    usuario: User;
}
