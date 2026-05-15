import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private auditLogsService: AuditLogsService,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const existingRole = await this.rolesRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException('Role with this name already exists');
    }

    const role = this.rolesRepository.create(createRoleDto);
    const saved = await this.rolesRepository.save(role);

    try {
      await this.auditLogsService.log({
        userId: 1,
        action: AuditAction.CREATE,
        entity: 'Role',
        entityId: saved.id,
        description: `Rol "${saved.name}" fue creado`,
        newValue: { name: saved.name, description: saved.description }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return saved;
  }

  async findAll(): Promise<Role[]> {
    return this.rolesRepository.find({ relations: ['users'] });
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    // Primero obtener el rol actual con relaciones
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.rolesRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException('Role with this name already exists');
      }
    }

    // Actualizar solo los campos proporcionados
    if (updateRoleDto.name !== undefined) {
      role.name = updateRoleDto.name;
    }
    if (updateRoleDto.description !== undefined) {
      role.description = updateRoleDto.description;
    }

    // Guardar cambios
    await this.rolesRepository.save(role);

    // Devolver el rol actualizado con relaciones desde la base de datos
    const updatedRole = await this.rolesRepository.findOne({
      where: { id: role.id },
      relations: ['users'],
      select: ['id', 'name', 'description', 'createdAt', 'updatedAt', 'users']
    });

    try {
      await this.auditLogsService.log({
        userId: 1,
        action: AuditAction.UPDATE,
        entity: 'Role',
        entityId: id,
        description: `Rol "${updatedRole.name}" fue actualizado`,
        newValue: { name: updatedRole.name, description: updatedRole.description }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return updatedRole;
  }

  async findByIds(ids: number[]): Promise<Role[]> {
    return this.rolesRepository.findByIds(ids);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({ where: { name } }) || null;
  }

  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.rolesRepository.remove(role);

    try {
      await this.auditLogsService.log({
        userId: 1,
        action: AuditAction.DELETE,
        entity: 'Role',
        entityId: id,
        description: `Rol "${role.name}" fue eliminado`,
        oldValue: { name: role.name, description: role.description }
      });
    } catch (e) { console.error('Error logging audit:', e); }
  }
}
