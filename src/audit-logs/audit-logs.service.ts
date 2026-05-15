import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async log(dto: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditLogsRepository.create(dto);
    return this.auditLogsRepository.save(log);
  }

  async findAll(limit: number = 50): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      relations: ['user', 'user.role'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async findByUser(userId: number): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { userId },
      relations: ['user', 'user.role'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByEntity(entity: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { entity },
      relations: ['user', 'user.role'],
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }
}
