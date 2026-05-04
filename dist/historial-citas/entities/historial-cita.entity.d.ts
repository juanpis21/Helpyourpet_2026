import { Cita } from '../../citas/entities/cita.entity';
import { User } from '../../users/entities/user.entity';
export declare class HistorialCita {
    id: number;
    cita: Cita;
    tipoCambio: string;
    descripcion: string;
    valorAnterior?: string;
    valorNuevo?: string;
    usuario: User;
    fechaRegistro: Date;
}
