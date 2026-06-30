import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
  ForbiddenException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)//ph rutas//
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: User })
  @ApiResponse({ status: 409, description: 'El nombre de usuario o email ya existe' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('superadmin', 'admin')
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('by-roles')
  @UseGuards(RolesGuard)
  @Roles('superadmin', 'admin', 'veterinario')
  @ApiOperation({ summary: 'Obtener usuarios filtrados por roles' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios filtrados por rol', type: [User] })
  findByRoles(@Query('roles') roles: string) {
    const roleNames = roles ? roles.split(',').map(r => r.trim()) : ['usuario', 'veterinario'];
    return this.usersService.findByRoles(roleNames);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string, @Request() req: any) {
    const user = req.user;
    const isOwner = user.userId === +id || user.id === +id;
    const isAdmin = user.role?.name === 'admin' || user.role?.name === 'superadmin' || user.role === 'admin' || user.role === 'superadmin';
    const isVeterinario = user.role?.name === 'veterinario' || user.role === 'veterinario';
    if (!isOwner && !isAdmin && !isVeterinario) {
      throw new ForbiddenException('No tienes permiso para acceder a este recurso.');
    }
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        address: { type: 'string' },
        documentType: { type: 'string' },
        documentNumber: { type: 'string' },
        age: { type: 'number' },
        avatar: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El nombre de usuario o email ya existe' })
  @UseInterceptors(FileInterceptor('avatar', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any, @UploadedFile() file?: Express.Multer.File) {
    const user = req.user;
    const isOwner = user.userId === +id || user.id === +id;
    const isAdmin = user.role?.name === 'admin' || user.role?.name === 'superadmin' || user.role === 'admin' || user.role === 'superadmin';
    const isVeterinario = user.role?.name === 'veterinario' || user.role === 'veterinario';
    if (!isOwner && !isAdmin && !isVeterinario) {
      throw new ForbiddenException('No tienes permiso para modificar este recurso.');
    }
    if (file) {
      updateUserDto.avatar = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar una cuenta (soft delete) - admin o el propio usuario' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 204, description: 'Cuenta desactivada' })
  @ApiResponse({ status: 403, description: 'No tienes permiso para desactivar esta cuenta' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  remove(@Param('id') id: string, @Request() req: any) {
    const requestingUser = req.user;
    const isOwner = requestingUser.userId === +id || requestingUser.id === +id;
    const isAdmin = requestingUser.role?.name === 'admin' || requestingUser.role?.name === 'superadmin'
      || requestingUser.role === 'admin' || requestingUser.role === 'superadmin';
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('No tienes permiso para desactivar esta cuenta.');
    }
    return this.usersService.deactivate(+id);
  }
}
