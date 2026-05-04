import { TokenRecuperacionService } from './token-recuperacion.service';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class TokenRecuperacionController {
    private readonly tokenRecuperacionService;
    constructor(tokenRecuperacionService: TokenRecuperacionService);
    solicitarRecuperacion(dto: SolicitarRecuperacionDto): Promise<{
        mensaje: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        mensaje: string;
    }>;
}
