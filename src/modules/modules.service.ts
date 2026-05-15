import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Module } from './entities/module.entity';
import { Role } from '../roles/entities/role.entity';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';

@Injectable()
export class ModulesService implements OnModuleInit {
  constructor(
    @InjectRepository(Module)
    private moduleRepository: Repository<Module>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private auditLogsService: AuditLogsService,
  ) {}

  async onModuleInit() {
    console.log('🚀 [ModulesService] Inicializando módulos y roles del sistema...');
    await this.createInitialModules();
  }

  async findAll(): Promise<Module[]> {
    return this.moduleRepository.find({
      relations: ['roles'],
    });
  }

  async findOne(id: number): Promise<Module> {
    return this.moduleRepository.findOne({
      where: { id },
      relations: ['roles'],
    });
  }

  async findByName(name: string): Promise<Module> {
    return this.moduleRepository.findOne({
      where: { name },
      relations: ['roles'],
    });
  }

  async createInitialModules(): Promise<Module[]> {
    // 1. Definir módulos base
    const modules = [
      { name: 'inicio', description: 'Módulo de inicio' },
      { name: 'sobre-nosotros', description: 'Módulo de sobre nosotros' },
      { name: 'adopcion', description: 'Módulo de adopción' },
      { name: 'tienda', description: 'Módulo de tienda' },
      { name: 'reporte', description: 'Módulo de reportes' },
      { name: 'calificacion', description: 'Módulo de calificaciones' },
      { name: 'veterinario', description: 'Módulo de veterinario' },
      { name: 'usuarios', description: 'Módulo global de usuarios' },
      { name: 'mascotas', description: 'Módulo global de mascotas' },
      { name: 'servicios', description: 'Módulo de servicios' },
      { name: 'pasarela-pagos', description: 'Módulo de pasarela de pagos' },
      { name: 'perfil-usuario', description: 'Módulo de perfil de usuario' },
      { name: 'perfil-veterinario', description: 'Módulo de perfil de veterinario' },
      { name: 'panel-admin', description: 'Módulo de panel de administrador' },
      { name: 'super-admin', description: 'Módulo de panel de super administrador' },
      { name: 'recovery', description: 'Módulo de recuperación de contraseña' },
      { name: 'Dashboard Maestro', description: 'Vista global de estadísticas' },
      { name: 'Gestión de Roles', description: 'Administración de roles del sistema' },
      { name: 'Permisos y Módulos', description: 'Configuración de acceso' },
      { name: 'Todos los Usuarios', description: 'Listado maestro de usuarios' },
      { name: 'Todas las Mascotas', description: 'Listado maestro de mascotas' },
      { name: 'Todas las Veterinarias', description: 'Gestión de sedes' }
    ];

    const createdModules: Module[] = [];

    for (const moduleData of modules) {
      let module = await this.moduleRepository.findOne({
        where: { name: moduleData.name },
      });

      if (!module) {
        module = this.moduleRepository.create(moduleData);
        module = await this.moduleRepository.save(module);
      }
      createdModules.push(module);
    }

    // 2. Definir roles base
    const rolesToCreate = [
      { name: 'SUPERADMIN', description: 'Super Administrador con acceso total al sistema' },
      { name: 'ADMIN', description: 'Administrador de veterinaria con acceso a gestión' },
      { name: 'VETERINARIO', description: 'Personal médico veterinario' },
      { name: 'USUARIO', description: 'Usuario estándar del sistema (dueño de mascota)' }
    ];

    for (const roleData of rolesToCreate) {
      // Buscar el rol ignorando mayúsculas/minúsculas
      let role = await this.roleRepository.findOne({ 
        where: [
          { name: roleData.name },
          { name: roleData.name.toLowerCase() }
        ]
      });

      if (!role) {
        role = this.roleRepository.create({
          name: roleData.name.toLowerCase(),
          description: roleData.description
        });
        role = await this.roleRepository.save(role);
        console.log(`✅ [ModulesService] Rol creado: ${roleData.name}`);
      }

      // Si el rol es de superadministrador, asignarle TODOS los módulos creados
      if (role.name.toLowerCase() === 'superadmin') {
        role.modules = createdModules;
        await this.roleRepository.save(role);
        console.log(`🔒 [ModulesService] Permisos totales asignados a: ${role.name}`);
      }
    }

    return createdModules;
  }

  async assignModulesToRole(roleId: number, moduleNames: string[]): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id: roleId },
      relations: ['modules'],
    });

    if (!role) {
      throw new Error(`Rol con ID ${roleId} no encontrado`);
    }

    const modules = await this.moduleRepository.find({
      where: moduleNames.map(name => ({ name })),
    });

    role.modules = modules;
    const saved = await this.roleRepository.save(role);

    try {
      await this.auditLogsService.log({
        userId: 1,
        action: AuditAction.UPDATE,
        entity: 'RoleModules',
        entityId: roleId,
        description: `Permisos actualizados para el rol "${role.name}": ${moduleNames.join(', ')}`,
        newValue: { modules: moduleNames }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return saved;
  }
}
