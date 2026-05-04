import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';
export declare class Servicio {
    id: number;
    nombre: string;
    descripcion: string;
    precioBase: number;
    duracionMinutos?: number;
    tipoServicio: string;
    requiereCita: boolean;
    isActive: boolean;
    veterinariaId: number;
    veterinaria: Veterinaria;
    imagen?: string;
    etiquetas?: string;
    createdAt: Date;
    updatedAt: Date;
}
