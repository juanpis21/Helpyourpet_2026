import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { VeterinarioController } from './veterinario.controller';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { PerfilVeterinario } from '../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { PermissionsModule } from '../permissions/permissions.module';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, PerfilVeterinario]), PermissionsModule, AuditLogsModule],
  controllers: [UsersController, VeterinarioController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
