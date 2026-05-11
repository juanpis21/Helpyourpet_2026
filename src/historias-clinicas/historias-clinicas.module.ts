import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoriasClinicasService } from './historias-clinicas.service';
import { HistoriasClinicasController } from './historias-clinicas.controller';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { ConsultaMedica } from './entities/consulta-medica.entity';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoriaClinica, ConsultaMedica]),
    PetsModule,
  ],
  controllers: [HistoriasClinicasController],
  providers: [HistoriasClinicasService],
  exports: [HistoriasClinicasService],
})
export class HistoriasClinicasModule {}
