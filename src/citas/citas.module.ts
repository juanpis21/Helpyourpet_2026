import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { Cita } from './entities/cita.entity';
import { UsersModule } from '../users/users.module';
import { PetsModule } from '../pets/pets.module';
import { RolesModule } from '../roles/roles.module';
import { HistorialCitasModule } from '../historial-citas/historial-citas.module';
import { PerfilVeterinario } from '../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { Veterinaria } from '../veterinarias/entities/veterinaria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cita, PerfilVeterinario, Servicio, Veterinaria]), UsersModule, PetsModule, RolesModule, forwardRef(() => HistorialCitasModule)],
  controllers: [CitasController],
  providers: [CitasService],
  exports: [CitasService],
})
export class CitasModule {}
