import { User } from '../../users/entities/user.entity';
export declare class Publicacion {
    id: number;
    descripcion: string;
    imagen?: string;
    autor: User;
    autorId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
