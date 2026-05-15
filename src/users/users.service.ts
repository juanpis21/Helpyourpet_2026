import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserByVetDto } from './dto/register-user-by-vet.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { PerfilVeterinario } from '../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { PermissionsService } from '../permissions/permissions.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AuditAction } from '../audit-logs/entities/audit-log.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    @InjectRepository(PerfilVeterinario)
    private perfilesRepository: Repository<PerfilVeterinario>,
    private permissionsService: PermissionsService,
    private auditLogsService: AuditLogsService,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // 1. Verificar si ya existe un usuario con el mismo username o email
    const existingByUserOrEmail = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingByUserOrEmail) {
      throw new ConflictException('El nombre de usuario o correo electrónico ya está en uso.');
    }

    // 2. PASO 6: Lógica para vincular cuenta pre-registrada por veterinario
    if (createUserDto.documentNumber) {
      const existingPreRegistered = await this.usersRepository.findOne({
        where: { 
          documentNumber: createUserDto.documentNumber,
          tieneCuenta: false 
        }
      });

      if (existingPreRegistered) {
        console.log('🔄 Vinculando cuenta pre-registrada para:', createUserDto.documentNumber);
        
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        
        // Actualizamos los campos necesarios del registro existente
        const updatedUser = Object.assign(existingPreRegistered, {
          ...createUserDto,
          password: hashedPassword,
          tieneCuenta: true,
          isActive: true
        });

        const savedUser = await this.usersRepository.save(updatedUser);
        
        // Crear permisos por defecto para el usuario que ahora tiene cuenta
        await this.permissionsService.createDefaultPermissions(savedUser.id);
        
        return savedUser;
      }
    }

    // 3. Registro normal si no existe pre-registro
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Obtener el rol por defecto 'usuario' o usar el roleId proporcionado
    let roleId = createUserDto.roleId;
    if (!roleId) {
      const defaultRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
      if (!defaultRole) {
        throw new NotFoundException('Default role "usuario" not found');
      }
      roleId = defaultRole.id;
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roleId,
      tieneCuenta: true // Al registrarse por sí mismo, ya tiene cuenta activa
    });

    const savedUser = await this.usersRepository.save(user);

    // Crear permisos por defecto para el nuevo usuario
    await this.permissionsService.createDefaultPermissions(savedUser.id);

    // Registrar en auditoría
    try {
      await this.auditLogsService.log({
        userId: savedUser.id,
        action: AuditAction.CREATE,
        entity: 'User',
        entityId: savedUser.id,
        description: `Usuario ${savedUser.username} se registró en el sistema`,
        newValue: { username: savedUser.username, email: savedUser.email, roleId: savedUser.roleId }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return savedUser;
  }

  async registerByVeterinario(registerDto: RegisterUserByVetDto, createdById: number): Promise<User> {
    console.log('📝 [UsersService] Registrando usuario por veterinario:', registerDto.documentNumber);

    // Buscar si ya existe el usuario por documento
    const existingUser = await this.usersRepository.findOne({
      where: { documentNumber: registerDto.documentNumber },
      relations: ['role']
    });

    if (existingUser) {
      console.log('🔄 [UsersService] Usuario ya existe, actualizando información y vinculando al veterinario.');
      
      // Si el usuario existe pero no tiene un creador asignado o es de tipo usuario sin cuenta
      // lo vinculamos al veterinario actual para que pueda verlo en su lista
      if (!existingUser.createdById) {
        existingUser.createdById = createdById;
      }

      // Actualizamos datos básicos si vienen en el DTO
      Object.assign(existingUser, {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone || existingUser.phone,
        address: registerDto.address || existingUser.address,
        age: registerDto.age || existingUser.age,
        documentType: registerDto.documentType,
        fullName: `${registerDto.firstName} ${registerDto.lastName}`
      });

      return this.usersRepository.save(existingUser);
    }

    // Si no existe, buscamos el rol 'usuario' dinámicamente
    const usuarioRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
    const roleId = usuarioRole ? usuarioRole.id : 4; // Fallback a 4 si no se encuentra

    const user = this.usersRepository.create({
      ...registerDto,
      roleId,
      tieneCuenta: false,
      createdById,
      isActive: true,
      fullName: `${registerDto.firstName} ${registerDto.lastName}`
    });

    console.log('✅ [UsersService] Creando nuevo usuario pre-registrado:', user.fullName);
    return this.usersRepository.save(user);
  }

  async findUsuariosByVeterinario(createdById: number): Promise<User[]> {
    console.log('🔍 [UsersService] Buscando usuarios registrados por veterinario ID:', createdById);
    
    // Buscar el rol 'usuario' dinámicamente para el filtro
    const usuarioRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
    const roleId = usuarioRole ? usuarioRole.id : 4;

    const users = await this.usersRepository.find({
      where: { roleId, createdById },
      relations: ['role'],
      select: ['id', 'firstName', 'lastName', 'fullName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'tieneCuenta', 'createdAt', 'createdById'],
      order: { createdAt: 'DESC' }
    });
    
    console.log(`✅ [UsersService] Usuarios encontrados: ${users.length}`);
    return users;
  }

  async findUsuariosByVeterinaria(veterinarioId: number): Promise<User[]> {
    console.log('🔍 [UsersService] Buscando usuarios por veterinaria del vet ID:', veterinarioId);

    // 1. Buscar el perfil del veterinario actual para saber su veterinaria
    const perfilVet = await this.perfilesRepository.findOne({
      where: { usuario: { id: veterinarioId }, isActive: true },
      relations: ['veterinariaPrincipal']
    });

    if (!perfilVet || !perfilVet.veterinariaPrincipal) {
      console.log('⚠️ [UsersService] No se encontró perfil o veterinaria para el vet ID:', veterinarioId);
      // Si no tiene veterinaria, devolvemos solo los suyos (fallback)
      return this.findUsuariosByVeterinario(veterinarioId);
    }

    const veterinariaId = perfilVet.veterinariaPrincipal.id;
    console.log('🏥 [UsersService] Veterinaria ID detectada:', veterinariaId);

    // 2. Obtener todos los veterinarios de esa misma veterinaria
    const todosLosVets = await this.perfilesRepository.find({
      where: { veterinariaPrincipal: { id: veterinariaId }, isActive: true },
      relations: ['usuario']
    });

    const vetIds = todosLosVets.map(pv => pv.usuario.id);
    console.log('👨‍⚕️ [UsersService] IDs de veterinarios en la misma clínica:', vetIds);

    // 3. Buscar usuarios creados por cualquiera de esos veterinarios
    const usuarioRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
    const roleId = usuarioRole ? usuarioRole.id : 4;

    const users = await this.usersRepository.find({
      where: { 
        roleId, 
        createdById: In(vetIds) 
      },
      relations: ['role'],
      select: ['id', 'firstName', 'lastName', 'fullName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'tieneCuenta', 'createdAt', 'createdById'],
      order: { createdAt: 'DESC' }
    });

    console.log(`✅ [UsersService] Usuarios de la veterinaria encontrados: ${users.length}`);
    return users;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['pets', 'role', 'perfilVeterinario', 'perfilVeterinario.veterinariaPrincipal'],
    });
  }

  async findByRoles(roleNames: string[]): Promise<User[]> {
    const roles = await this.rolesRepository.find({
      where: { name: In(roleNames.map(r => r.toLowerCase())) },
    });
    if (!roles.length) return [];
    const roleIds = roles.map(r => r.id);
    return this.usersRepository.find({
      where: { roleId: In(roleIds) },
      relations: ['pets', 'role', 'perfilVeterinario', 'perfilVeterinario.veterinariaPrincipal'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['pets', 'role', 'role.modules', 'perfilVeterinario', 'perfilVeterinario.veterinariaPrincipal'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(identifier: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [
        { username: identifier },
        { email: identifier },
      ],
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'password', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    return user || null;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'password', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    console.log(`🚀 [UsersService] Iniciando actualización para usuario ID: ${id}`);
    
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['pets', 'role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Clonar el DTO para no modificar el original y manejar campos especiales
    const updateData: any = { ...updateUserDto };

    // Validación de duplicados si se cambia email o username
    if (updateData.username || updateData.email) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { username: updateData.username },
          { email: updateData.email },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username or email already exists');
      }
    }

    // Gestión de contraseña
    if (updateData.password) {
      if (updateData.password.trim().length === 0) {
        console.warn('⚠️ [UsersService] Se recibió una contraseña vacía, ignorando actualización de password.');
        delete updateData.password;
      } else {
        console.log(`🔐 [UsersService] Hasheando nueva contraseña para usuario ${user.username}...`);
        updateData.password = await bcrypt.hash(updateData.password, 10);
        console.log('✅ [UsersService] Contraseña hasheada correctamente.');
      }
    }

    // Limpiar campos que no deben ir en el update (como relaciones o campos calculados)
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.role;
    delete updateData.pets;

    if (Object.keys(updateData).length > 0) {
      console.log(`📝 [UsersService] Campos a actualizar: ${Object.keys(updateData).join(', ')}`);
      const updateResult = await this.usersRepository.update(id, updateData);
      console.log(`✅ [UsersService] Resultado: ${updateResult.affected} fila(s) afectada(s).`);
    } else {
      console.log('ℹ️ [UsersService] No hay campos para actualizar.');
    }

    // Retornar el usuario actualizado
    const updatedUser = await this.findOne(id);

    // Registrar en auditoría
    try {
      await this.auditLogsService.log({
        userId: id,
        action: AuditAction.UPDATE,
        entity: 'User',
        entityId: id,
        description: `Usuario ${updatedUser.username} actualizó su perfil`,
        oldValue: { username: user.username, email: user.email, isActive: user.isActive },
        newValue: { username: updatedUser.username, email: updatedUser.email, isActive: updatedUser.isActive }
      });
    } catch (e) { console.error('Error logging audit:', e); }

    return updatedUser;
  }

  async deactivate(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);

    try {
      await this.auditLogsService.log({
        userId: id,
        action: AuditAction.STATUS_CHANGE,
        entity: 'User',
        entityId: id,
        description: `Usuario ${user.username} fue desactivado`,
        oldValue: { isActive: true },
        newValue: { isActive: false }
      });
    } catch (e) { console.error('Error logging audit:', e); }
  }
}
