import { Controller, Post, Body, HttpCode, HttpStatus, Get, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService, AuthResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface VerifyPasswordDto {
  userId: number;
  password: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login exitoso', 
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            fullName: { type: 'string' },
            phone: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string' },
            updatedAt: { type: 'string' },
            roles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  description: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(loginDto);
  }

  @Get('check-status')
  @ApiOperation({ summary: 'Verificar estado de autenticación' })
  async checkStatus(@Request() req): Promise<AuthResponse> {
    return this.authService.checkStatus(req.user);
  }

  @Post('verify-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verificar contraseña actual del usuario' })
  @ApiResponse({ status: 200, description: 'Contraseña verificada', type: Boolean })
  @ApiResponse({ status: 401, description: 'Contraseña incorrecta' })
  async verifyPassword(@Body() verifyPasswordDto: VerifyPasswordDto): Promise<boolean> {
    return this.authService.verifyPassword(verifyPasswordDto.userId, verifyPasswordDto.password);
  }
}
