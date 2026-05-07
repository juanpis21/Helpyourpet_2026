import { 
  Controller, 
  Post, 
  Get,
  Body, 
  UseGuards, 
  Req,
  ForbiddenException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { RegisterUserByVetDto } from './dto/register-user-by-vet.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('veterinario')
@Controller('veterinario')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VeterinarioController {
  constructor(private readonly usersService: UsersService) {}

  @Post('registrar-usuario')
  @ApiOperation({ summary: 'Registrar un nuevo dueño de mascota (solo veterinarios)' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente o retornado el existente', type: User })
  @ApiResponse({ status: 403, description: 'Acceso denegado. Solo veterinarios pueden realizar esta acción.' })
  async registerUser(@Body() registerDto: RegisterUserByVetDto, @Req() req: any) {
    const user = req.user;
    
    // Verificar que el usuario tenga rol de veterinario (roleId 3)
    if (user.roleId !== 3) {
      throw new ForbiddenException('Solo los veterinarios pueden registrar usuarios de esta forma.');
    }

    return this.usersService.registerByVeterinario(registerDto, user.userId);
  }

  @Get('usuarios')
  @ApiOperation({ summary: 'Obtener usuarios sin cuenta activa registrados por veterinarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios sin cuenta', type: [User] })
  async getUsuariosSinCuenta(@Req() req: any) {
    const user = req.user;
    if (user.roleId !== 3) {
      throw new ForbiddenException('Solo los veterinarios pueden ver esta lista.');
    }
    return this.usersService.findUsuariosByVeterinario(user.userId);
  }
}
