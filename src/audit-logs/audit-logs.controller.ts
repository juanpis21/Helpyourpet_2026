import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { AuditLog } from './entities/audit-log.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('audit-logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los registros de auditoría' })
  @ApiQuery({ name: 'limit', description: 'Cantidad máxima de registros', required: false })
  @ApiResponse({ status: 200, description: 'Lista de registros de auditoría', type: [AuditLog] })
  findAll(@Query('limit') limit?: string) {
    return this.auditLogsService.findAll(limit ? +limit : 50);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener auditoría por usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Registros del usuario', type: [AuditLog] })
  findByUser(@Param('userId') userId: string) {
    return this.auditLogsService.findByUser(+userId);
  }

  @Get('entity/:entity')
  @ApiOperation({ summary: 'Obtener auditoría por tipo de entidad' })
  @ApiParam({ name: 'entity', description: 'Nombre de la entidad (User, Pet, Veterinaria, etc.)' })
  @ApiResponse({ status: 200, description: 'Registros de la entidad', type: [AuditLog] })
  findByEntity(@Param('entity') entity: string) {
    return this.auditLogsService.findByEntity(entity);
  }
}
