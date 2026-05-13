import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
  ) {}

  async create(createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
    const announcement = this.announcementsRepository.create(createAnnouncementDto);
    return await this.announcementsRepository.save(announcement);
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
    return await this.announcementsRepository.save(announcement);
  }

  async remove(id: number): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementsRepository.remove(announcement);
  }
}
