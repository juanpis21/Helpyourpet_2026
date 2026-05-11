import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { CreateConsultaMedicaDto } from './dto/create-consulta-medica.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('historias-clinicas')
@Controller('historias-clinicas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HistoriasClinicasController {
  constructor(private readonly service: HistoriasClinicasService) {}

  // ─── HISTORIA CLÍNICA ────────────────────────────────────────────────────────

  @Post()
  @ApiOperation({ summary: 'Crear una nueva historia clínica' })
  create(@Body() dto: CreateHistoriaClinicaDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las historias clínicas' })
  findAll() {
    return this.service.findAll();
  }

  @Get('mascota/:mascotaId')
  @ApiOperation({ summary: 'Obtener o crear automáticamente la historia clínica de una mascota' })
  findOrCreateByMascota(@Param('mascotaId') mascotaId: string) {
    return this.service.findOrCreateByMascota(+mascotaId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener historia clínica por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar datos fijos de la historia clínica (alergias, vacunas, etc.)' })
  update(@Param('id') id: string, @Body() dto: UpdateHistoriaClinicaDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una historia clínica' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  // ─── CONSULTAS MÉDICAS ───────────────────────────────────────────────────────

  @Post('consultas')
  @ApiOperation({ summary: 'Registrar una nueva consulta médica dentro de una historia clínica' })
  createConsulta(@Body() dto: CreateConsultaMedicaDto) {
    return this.service.createConsulta(dto);
  }

  @Get(':historiaId/consultas')
  @ApiOperation({ summary: 'Listar todas las consultas de una historia clínica' })
  getConsultas(@Param('historiaId') historiaId: string) {
    return this.service.findConsultasByHistoria(+historiaId);
  }

  @Delete('consultas/:id')
  @ApiOperation({ summary: 'Eliminar una consulta médica' })
  removeConsulta(@Param('id') id: string) {
    return this.service.removeConsulta(+id);
  }
}
