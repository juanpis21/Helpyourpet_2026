import { Repository } from 'typeorm';
import { TokenRecuperacion } from './entities/token-recuperacion.entity';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { MailerService } from '@nestjs-modules/mailer';
export declare class TokenRecuperacionService {
    private tokenRepository;
    private usersService;
    private mailerService;
    constructor(tokenRepository: Repository<TokenRecuperacion>, usersService: UsersService, mailerService: MailerService);
    solicitarRecuperacion(dto: SolicitarRecuperacionDto): Promise<{
        mensaje: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        mensaje: string;
    }>;
}
