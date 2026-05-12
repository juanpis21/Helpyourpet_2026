import { AuthService, AuthResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
interface VerifyPasswordDto {
    userId: number;
    password: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<AuthResponse>;
    checkStatus(req: any): Promise<AuthResponse>;
    verifyPassword(verifyPasswordDto: VerifyPasswordDto): Promise<boolean>;
}
export {};
