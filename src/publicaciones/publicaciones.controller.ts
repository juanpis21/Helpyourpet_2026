import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Publicacion } from './entities/publicacion.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';
import { extname } from 'path';

@ApiTags('publicaciones')
@Controller('publicaciones')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva publicación' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        descripcion: { type: 'string' },
        autorId: { type: 'number' },
        imagen: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Publicación creada exitosamente', type: Publicacion })
  @ApiResponse({ status: 409, description: 'La publicación ya existe' })
  @UseInterceptors(FileInterceptor('imagen', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  }))
  async create(@Request() req, @Body() createPublicacionDto: CreatePublicacionDto, @UploadedFile() file?: Express.Multer.File) {
    const { userId } = req.user;
    
    // Si no se proporciona autorId, se asigna al usuario autenticado
    if (!createPublicacionDto.autorId) {
      createPublicacionDto.autorId = userId;
    }

    // Si se subió una imagen, guardar en Base64
    if (file) {
      createPublicacionDto.imagen = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }

    return await this.publicacionesService.create(createPublicacionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las publicaciones' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones', type: [Publicacion] })
  async findAll(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const limitNum = limit ? parseInt(limit, 10) : undefined;
    const offsetNum = offset ? parseInt(offset, 10) : undefined;
    return await this.publicacionesService.findAll(limitNum, offsetNum);
  }

  @Get('autor/:autorId')
  @ApiOperation({ summary: 'Obtener publicaciones por autor' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones del autor', type: [Publicacion] })
  async findByAutor(@Param('autorId') autorId: string) {
    return await this.publicacionesService.findByAutor(+autorId);
  }

  @Get('veterinaria/:veterinariaId')
  @ApiOperation({ summary: 'Obtener publicaciones por veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones de todos los vets de la veterinaria', type: [Publicacion] })
  async findByVeterinaria(@Param('veterinariaId') veterinariaId: string) {
    return await this.publicacionesService.findByVeterinaria(+veterinariaId);
  }

  @Post(':id/reportar')
  @ApiOperation({ summary: 'Reportar una publicación' })
  @ApiResponse({ status: 200, description: 'Publicación reportada' })
  async reportar(@Param('id') id: string, @Request() req) {
    const { userId } = req.user;
    return await this.publicacionesService.reportar(+id, userId);
  }

  @Get('reportadas/veterinaria/:veterinariaId')
  @ApiOperation({ summary: 'Obtener publicaciones reportadas de una veterinaria' })
  @ApiResponse({ status: 200, description: 'Lista de publicaciones reportadas', type: [Publicacion] })
  async findReportadasByVeterinaria(@Param('veterinariaId') veterinariaId: string) {
    return await this.publicacionesService.findReportadasByVeterinaria(+veterinariaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una publicación por ID' })
  @ApiResponse({ status: 200, description: 'Publicación encontrada', type: Publicacion })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async findOne(@Param('id') id: string) {
    return await this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una publicación' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)'), false);
      } else {
        cb(null, true);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  @ApiResponse({ status: 200, description: 'Publicación actualizada', type: Publicacion })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async update(@Param('id') id: string, @Body() updatePublicacionDto: UpdatePublicacionDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      updatePublicacionDto.imagen = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }
    return await this.publicacionesService.update(+id, updatePublicacionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una publicación (soft delete)' })
  @ApiResponse({ status: 200, description: 'Publicación eliminada' })
  @ApiResponse({ status: 404, description: 'Publicación no encontrada' })
  async remove(@Param('id') id: string) {
    return await this.publicacionesService.remove(+id);
  }

  @Post(':id/like')
  @ApiOperation({ summary: 'Dar o quitar like a una publicación' })
  @ApiResponse({ status: 200, description: 'Like toggled exitosamente' })
  async toggleLike(@Param('id') id: string, @Request() req) {
    const { userId } = req.user;
    return await this.publicacionesService.toggleLike(+id, userId);
  }

  @Post(':id/comentarios')
  @ApiOperation({ summary: 'Agregar un comentario a una publicación' })
  @ApiResponse({ status: 201, description: 'Comentario creado exitosamente' })
  async agregarComentario(@Param('id') id: string, @Body('contenido') contenido: string, @Request() req) {
    const { userId } = req.user;
    return await this.publicacionesService.agregarComentario(+id, userId, contenido);
  }

  @Post(':id/compartir')
  @ApiOperation({ summary: 'Compartir una publicación' })
  @ApiResponse({ status: 201, description: 'Publicación compartida exitosamente', type: Publicacion })
  async compartir(@Param('id') id: string, @Request() req) {
    const { userId } = req.user;
    return await this.publicacionesService.compartir(+id, userId);
  }
}
