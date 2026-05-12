import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PermissionsService } from '../permissions/permissions.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

export interface AuthResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private permissionsService: PermissionsService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log(`🔍 [AuthService] Intentando validar usuario: ${username}`);
    const user = await this.usersService.findByUsername(username);

    if (!user) {
      console.warn(`❌ [AuthService] Usuario no encontrado: ${username}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      console.log(`✅ [AuthService] Usuario validado con éxito: ${username}`);
      const { password, ...result } = user;
      return result;
    }

    console.warn(`❌ [AuthService] Contraseña incorrecta para el usuario: ${username}`);
    return null;
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Su cuenta está desactivada. Por favor, contacte al soporte.');
    }

    const payload = { 
      username: user.username, 
      sub: user.id, 
      role: user.role ?? 'usuario'
    };

    // Cargar usuario con roles y módulos
    const userWithRoles = await this.usersService.findOne(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      user: userWithRoles,
    };
  }

  async checkStatus(user: any): Promise<AuthResponse> {
    const userWithRoles = await this.usersService.findOne(user.id);
    return {
      access_token: '', // No generamos nuevo token
      user: userWithRoles,
    };
  }

  async verifyPassword(userId: number, password: string): Promise<boolean> {
    try {
      const user = await this.usersService.findOne(userId);
      if (!user || !user.password) {
        return false;
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      return isPasswordValid;
    } catch (error) {
      console.error('❌ [AuthService] Error al verificar contraseña:', error);
      return false;
    }
  }
}
