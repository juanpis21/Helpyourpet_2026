import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserByVetDto } from './dto/register-user-by-vet.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../roles/entities/role.entity';
import { PermissionsService } from '../permissions/permissions.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private permissionsService: PermissionsService,
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

    return savedUser;
  }

  async registerByVeterinario(registerDto: RegisterUserByVetDto, createdById: number): Promise<User> {
    const existingUser = await this.usersRepository.findOne({
      where: { documentNumber: registerDto.documentNumber },
      relations: ['role']
    });

    if (existingUser) {
      console.log('User already exists with document number:', registerDto.documentNumber);
      return existingUser;
    }

    const user: User = this.usersRepository.create({
      ...registerDto,
      roleId: 4, // Rol por defecto 'usuario'
      tieneCuenta: false,
      createdById,
      isActive: true,
      fullName: `${registerDto.firstName} ${registerDto.lastName}`
    });

    return this.usersRepository.save(user);
  }

  async findUsuariosByVeterinario(createdById: number): Promise<User[]> {
    console.log('🔍 Buscando todos los usuarios registrados por vet ID:', createdById);
    const users = await this.usersRepository.find({
      where: { roleId: 4, createdById },
      relations: ['role'],
      select: ['id', 'firstName', 'lastName', 'fullName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'tieneCuenta', 'createdAt', 'createdById']
    });
    console.log(`✅ Usuarios encontrados: ${users.length}`);
    return users;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
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
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['pets', 'role', 'role.modules'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
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
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { username: updateUserDto.username },
          { email: updateUserDto.email },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Username or email already exists');
      }
    }

    if (updateUserDto.password) {
      console.log(`🔐 [UsersService] Solicitud de cambio de contraseña para usuario ID: ${id}`);
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      const updateResult = await this.usersRepository.update(id, { password: hashedPassword });
      console.log(`✅ [UsersService] Resultado de actualización de password:`, updateResult.affected > 0 ? 'EXITOSO' : 'FALLIDO');
      delete updateUserDto.password;
    }

    if (Object.keys(updateUserDto).length > 0) {
      console.log(`📝 [UsersService] Actualizando otros campos para usuario ID: ${id}`);
      await this.usersRepository.update(id, updateUserDto);
    }

    const updatedUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['pets', 'role'],
      select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
    });

    return updatedUser;
  }

  async deactivate(id: number): Promise<void> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.usersRepository.save(user);
  }
}
