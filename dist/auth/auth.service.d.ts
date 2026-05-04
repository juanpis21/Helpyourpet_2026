import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
export interface AuthResponse {
    access_token: string;
    user: Omit<User, 'password'>;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private permissionsService;
    constructor(usersService: UsersService, jwtService: JwtService, permissionsService: PermissionsService);
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    checkStatus(user: any): Promise<AuthResponse>;
}
