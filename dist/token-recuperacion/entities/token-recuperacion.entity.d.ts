import { User } from '../../users/entities/user.entity';
export declare class TokenRecuperacion {
    id: number;
    token: string;
    fechaExpiracion: Date;
    usuarioId: number;
    usuario: User;
    createdAt: Date;
}
