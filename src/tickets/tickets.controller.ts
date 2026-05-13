import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('tickets')
@Controller('tickets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo ticket' })
  create(@Body() createTicketDto: CreateTicketDto, @Request() req) {
    return this.ticketsService.create(createTicketDto, req.user.userId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Obtener todos los tickets (Solo Super-Admin)' })
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get('my-tickets')
  @ApiOperation({ summary: 'Obtener tickets del usuario actual' })
  findMyTickets(@Request() req) {
    return this.ticketsService.findByUser(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obener un ticket por ID' })
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Actualizar un ticket (Solo Super-Admin)' })
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Actualizar estado de un ticket (Solo Super-Admin)' })
  updateStatus(@Param('id') id: string, @Body('estado') estado: string) {
    return this.ticketsService.updateStatus(+id, estado as any);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('superadmin')
  @ApiOperation({ summary: 'Eliminar un ticket (Solo Super-Admin)' })
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
