import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { Module } from './entities/module.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('modules')
@Controller('modules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los módulos' })
  async findAll(): Promise<Module[]> {
    return this.modulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un módulo por ID' })
  async findOne(@Param('id') id: string): Promise<Module> {
    return this.modulesService.findOne(+id);
  }

  @Post('seed')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Crear módulos iniciales' })
  async createInitialModules(): Promise<Module[]> {
    return this.modulesService.createInitialModules();
  }

  @Post('assign/:roleId')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Asignar módulos a un rol' })
  async assignModulesToRole(
    @Param('roleId') roleId: string,
    @Body() body: { moduleNames: string[] }
  ): Promise<any> {
    return this.modulesService.assignModulesToRole(+roleId, body.moduleNames);
  }
}
