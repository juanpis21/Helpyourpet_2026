import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { Module } from './entities/module.entity';
import { Role } from '../roles/entities/role.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@NestModule({
  imports: [TypeOrmModule.forFeature([Module, Role]), AuditLogsModule],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [ModulesService],
})
export class ModulesModule {}
