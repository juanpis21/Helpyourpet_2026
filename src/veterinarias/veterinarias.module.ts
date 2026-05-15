import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VeterinariasController } from './veterinarias.controller';
import { VeterinariasService } from './veterinarias.service';
import { Veterinaria } from './entities/veterinaria.entity';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Veterinaria]), AuditLogsModule],
  controllers: [VeterinariasController],
  providers: [VeterinariasService],
  exports: [VeterinariasService],
})
export class VeterinariasModule {}
