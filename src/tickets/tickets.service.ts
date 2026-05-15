import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createTicketDto: CreateTicketDto, userId: number): Promise<Ticket> {
    const ticket = this.ticketsRepository.create({
      ...createTicketDto,
      userId,
    });
    const saved = await this.ticketsRepository.save(ticket);

    try {
      await this.auditLogsService.log({
        userId,
        action: AuditAction.CREATE,
        entity: 'Ticket',
        entityId: saved.id,
        description: `Ticket #${saved.id} "${saved.asunto}" fue creado`,
        newValue: { asunto: saved.asunto, prioridad: saved.prioridad }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return saved;
  }

  async findAll(): Promise<Ticket[]> {
    return await this.ticketsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<Ticket[]> {
    return await this.ticketsRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Ticket> {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!ticket) {
      throw new NotFoundException('Ticket no encontrado');
    }
    return ticket;
  }

  async update(id: number, updateTicketDto: UpdateTicketDto): Promise<Ticket> {
    const ticket = await this.findOne(id);
    Object.assign(ticket, updateTicketDto);
    return await this.ticketsRepository.save(ticket);
  }

  async remove(id: number): Promise<void> {
    const ticket = await this.findOne(id);
    await this.ticketsRepository.remove(ticket);

    try {
      await this.auditLogsService.log({
        userId: ticket.userId,
        action: AuditAction.DELETE,
        entity: 'Ticket',
        entityId: id,
        description: `Ticket #${id} "${ticket.asunto}" fue eliminado`,
        oldValue: { asunto: ticket.asunto, estado: ticket.estado }
      });
    } catch (e) { console.error('Error logging audit:', e); }
  }

  async updateStatus(id: number, estado: TicketStatus): Promise<Ticket> {
    const ticket = await this.findOne(id);
    const oldEstado = ticket.estado;
    ticket.estado = estado;
    const saved = await this.ticketsRepository.save(ticket);

    try {
      await this.auditLogsService.log({
        userId: ticket.userId,
        action: AuditAction.STATUS_CHANGE,
        entity: 'Ticket',
        entityId: id,
        description: `Ticket #${id} cambió de "${oldEstado}" a "${estado}"`,
        oldValue: { estado: oldEstado },
        newValue: { estado }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return saved;
  }
}
