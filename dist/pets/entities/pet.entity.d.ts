import { User } from '../../users/entities/user.entity';
import { Cita } from '../../citas/entities/cita.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';
export declare class Pet {
    id: number;
    name: string;
    species: string;
    breed: string;
    age: number;
    gender: string;
    color: string;
    weight: number;
    description: string;
    foto: string;
    ownerId: number;
    owner: User;
    citas: Cita[];
    emergencias: Emergencia[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
