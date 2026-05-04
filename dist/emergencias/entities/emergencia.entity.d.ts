import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../roles/entities/role.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
export declare class Emergencia {
    id: number;
    tipo: string;
    fechayhora: Date;
    descripcion: string;
    mascota: Pet;
    veterinario: Role;
    veterinaria: Veterinaria;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
