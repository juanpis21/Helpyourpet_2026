import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
export declare class Evento {
    id: number;
    titulo: string;
    descripcion: string;
    imagen: string;
    fechaInicio: Date;
    fechaFin: Date;
    veterinariaId: number;
    veterinaria: Veterinaria;
    createdAt: Date;
    updatedAt: Date;
}
