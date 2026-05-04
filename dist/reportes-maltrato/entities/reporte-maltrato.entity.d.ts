import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
export declare enum EstadoReporte {
    PENDIENTE = "PENDIENTE",
    EN_REVISION = "EN_REVISION",
    RESUELTO = "RESUELTO"
}
export declare class ReporteMaltrato {
    id: number;
    descripcion: string;
    estado: EstadoReporte;
    usuarioId: number;
    usuario: User;
    mascotaId: number;
    mascota: Pet;
    fecha: Date;
    updatedAt: Date;
}
