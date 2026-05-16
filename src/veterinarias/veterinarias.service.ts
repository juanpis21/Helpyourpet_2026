import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Veterinaria } from './entities/veterinaria.entity';
import { CreateVeterinariaDto } from './dto/create-veterinaria.dto';
import { UpdateVeterinariaDto } from './dto/update-veterinaria.dto';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class VeterinariasService {
  constructor(
    @InjectRepository(Veterinaria)
    private veterinariasRepository: Repository<Veterinaria>,
    private auditLogsService: AuditLogsService,
  ) {}

  async create(createVeterinariaDto: CreateVeterinariaDto): Promise<Veterinaria> {
    // Verificar si ya existe una veterinaria con el mismo RUT
    const existingRut = await this.veterinariasRepository.findOne({
      where: { rut: createVeterinariaDto.rut },
    });

    if (existingRut) {
      throw new ConflictException('Veterinaria with this RUT already exists');
    }

    // Verificar si ya existe una veterinaria con el mismo email
    const existingEmail = await this.veterinariasRepository.findOne({
      where: { email: createVeterinariaDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('Veterinaria with this email already exists');
    }

    const veterinaria = this.veterinariasRepository.create(createVeterinariaDto);
    const saved = await this.veterinariasRepository.save(veterinaria);

    try {
      await this.auditLogsService.log({
        userId: createVeterinariaDto.adminId || 1,
        action: AuditAction.CREATE,
        entity: 'Veterinaria',
        entityId: saved.id,
        description: `Veterinaria "${saved.nombre}" fue registrada`,
        newValue: { nombre: saved.nombre, direccion: saved.direccion, rut: saved.rut }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return saved;
  }

  async findAll(): Promise<Veterinaria[]> {
    return this.veterinariasRepository.find({ 
      relations: ['admin'],
      select: ['id', 'nombre', 'direccion', 'telefono', 'email', 'descripcion', 'rut', 'isActive', 'adminId', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: number): Promise<Veterinaria> {
    const veterinaria = await this.veterinariasRepository.findOne({
      where: { id },
      relations: ['admin'],
      select: ['id', 'nombre', 'direccion', 'telefono', 'email', 'descripcion', 'rut', 'isActive', 'adminId', 'createdAt', 'updatedAt']
    });

    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria with ID ${id} not found`);
    }

    return veterinaria;
  }

  async update(id: number, updateVeterinariaDto: UpdateVeterinariaDto): Promise<Veterinaria> {
    // Primero obtener la veterinaria actual
    const veterinaria = await this.veterinariasRepository.findOne({
      where: { id },
    });

    if (!veterinaria) {
      throw new NotFoundException(`Veterinaria with ID ${id} not found`);
    }

    // Actualizar solo los campos proporcionados
    if (updateVeterinariaDto.nombre !== undefined) {
      veterinaria.nombre = updateVeterinariaDto.nombre;
    }
    if (updateVeterinariaDto.direccion !== undefined) {
      veterinaria.direccion = updateVeterinariaDto.direccion;
    }
    if (updateVeterinariaDto.telefono !== undefined) {
      veterinaria.telefono = updateVeterinariaDto.telefono;
    }
    if (updateVeterinariaDto.email !== undefined) {
      veterinaria.email = updateVeterinariaDto.email;
    }
    if (updateVeterinariaDto.descripcion !== undefined) {
      veterinaria.descripcion = updateVeterinariaDto.descripcion;
    }
    if (updateVeterinariaDto.rut !== undefined) {
      veterinaria.rut = updateVeterinariaDto.rut;
    }
    if (updateVeterinariaDto.isActive !== undefined) {
      veterinaria.isActive = updateVeterinariaDto.isActive;
    }
    if (updateVeterinariaDto.adminId !== undefined) {
      veterinaria.adminId = updateVeterinariaDto.adminId;
    }

    const updated = await this.veterinariasRepository.save(veterinaria);

    try {
      await this.auditLogsService.log({
        userId: updateVeterinariaDto.adminId || veterinaria.adminId || 1,
        action: AuditAction.UPDATE,
        entity: 'Veterinaria',
        entityId: id,
        description: `Veterinaria "${updated.nombre}" fue actualizada`,
        newValue: { nombre: updated.nombre, direccion: updated.direccion }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const veterinaria = await this.findOne(id);
    await this.veterinariasRepository.remove(veterinaria);

    try {
      await this.auditLogsService.log({
        userId: veterinaria.adminId || 1,
        action: AuditAction.DELETE,
        entity: 'Veterinaria',
        entityId: id,
        description: `Veterinaria "${veterinaria.nombre}" fue eliminada`,
        oldValue: { nombre: veterinaria.nombre, rut: veterinaria.rut }
      });
    } catch (e) { console.error('Error logging audit:', e); }
  }

  async findByAdminId(adminId: number): Promise<Veterinaria | null> {
    return this.veterinariasRepository.findOne({
      where: { adminId },
      relations: ['admin'],
      select: ['id', 'nombre', 'direccion', 'telefono', 'email', 'descripcion', 'rut', 'isActive', 'adminId', 'createdAt', 'updatedAt']
    });
  }
}
