import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementsRepository.create(createAnnouncementDto);
    const saved = await this.announcementsRepository.save(announcement);

    try {
      await this.auditLogsService.log({
        userId: 1,
        action: AuditAction.CREATE,
        entity: 'Announcement',
        entityId: saved.id,
        description: `Anuncio "${saved.titulo}" fue creado`,
        newValue: { titulo: saved.titulo }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return saved;
  }

  async findAll(): Promise<Announcement[]> {
    return await this.announcementsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findActive(): Promise<Announcement[]> {
    const now = new Date();
    return await this.announcementsRepository
      .createQueryBuilder('announcement')
      .where('announcement.isActive = :isActive', { isActive: true })
      .andWhere(
        '(announcement.fechaExpiracion IS NULL OR announcement.fechaExpiracion > :now)',
        { now },
      )
      .orderBy('announcement.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementsRepository.findOne({
      where: { id },
    });
    if (!announcement) {
      throw new NotFoundException('Anuncio no encontrado');
    }
    return announcement;
  }

  async update(id: number, updateAnnouncementDto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.findOne(id);
    Object.assign(announcement, updateAnnouncementDto);
    const saved = await this.announcementsRepository.save(announcement);

    try {
      await this.auditLogsService.log({
        userId: 1,
        action: AuditAction.UPDATE,
        entity: 'Announcement',
        entityId: id,
        description: `Anuncio "${saved.titulo}" fue actualizado`,
        newValue: { titulo: saved.titulo, isActive: saved.isActive }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return saved;
  }

  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementsRepository.remove(announcement);

    try {
      await this.auditLogsService.log({
        userId: 1,
        action: AuditAction.DELETE,
        entity: 'Announcement',
        entityId: id,
        description: `Anuncio "${announcement.titulo}" fue eliminado`,
        oldValue: { titulo: announcement.titulo }
      });
    } catch (e) { console.error('Error logging audit:', e); }
  }
}
