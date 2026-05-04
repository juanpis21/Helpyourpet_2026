import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../roles/entities/role.entity';
import { HistorialCita } from '../../historial-citas/entities/historial-cita.entity';
export declare class Cita {
    id: number;
    motivo: string;
    fechaHora: Date;
    estado: string;
    notas?: string;
    usuario: User;
    veterinario: Role;
    mascota: Pet;
    historial: HistorialCita[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
