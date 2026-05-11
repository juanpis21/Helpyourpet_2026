import { Pet } from '../../pets/entities/pet.entity';
export declare class HistoriaClinica {
    id: number;
    mascotaId: number;
    mascota: Pet;
    alergias: string;
    antecedentes: string;
    vacunas: string;
    esterilizado: boolean;
    observaciones_generales: string;
    fechaApertura: Date;
    consultas: any[];
}
