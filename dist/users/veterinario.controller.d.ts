import { UsersService } from './users.service';
import { RegisterUserByVetDto } from './dto/register-user-by-vet.dto';
import { User } from './entities/user.entity';
export declare class VeterinarioController {
    private readonly usersService;
    constructor(usersService: UsersService);
    registerUser(registerDto: RegisterUserByVetDto, req: any): Promise<User>;
    getUsuariosSinCuenta(req: any): Promise<User[]>;
}
