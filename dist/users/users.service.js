"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const role_entity_1 = require("../roles/entities/role.entity");
const permissions_service_1 = require("../permissions/permissions.service");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(usersRepository, rolesRepository, permissionsService) {
        this.usersRepository = usersRepository;
        this.rolesRepository = rolesRepository;
        this.permissionsService = permissionsService;
    }
    async create(createUserDto) {
        const existingByUserOrEmail = await this.usersRepository.findOne({
            where: [
                { username: createUserDto.username },
                { email: createUserDto.email },
            ],
        });
        if (existingByUserOrEmail) {
            throw new common_1.ConflictException('El nombre de usuario o correo electrónico ya está en uso.');
        }
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
                const updatedUser = Object.assign(existingPreRegistered, {
                    ...createUserDto,
                    password: hashedPassword,
                    tieneCuenta: true,
                    isActive: true
                });
                const savedUser = await this.usersRepository.save(updatedUser);
                await this.permissionsService.createDefaultPermissions(savedUser.id);
                return savedUser;
            }
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        let roleId = createUserDto.roleId;
        if (!roleId) {
            const defaultRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
            if (!defaultRole) {
                throw new common_1.NotFoundException('Default role "usuario" not found');
            }
            roleId = defaultRole.id;
        }
        const user = this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
            roleId,
            tieneCuenta: true
        });
        const savedUser = await this.usersRepository.save(user);
        await this.permissionsService.createDefaultPermissions(savedUser.id);
        return savedUser;
    }
    async registerByVeterinario(registerDto, createdById) {
        console.log('📝 [UsersService] Registrando usuario por veterinario:', registerDto.documentNumber);
        const existingUser = await this.usersRepository.findOne({
            where: { documentNumber: registerDto.documentNumber },
            relations: ['role']
        });
        if (existingUser) {
            console.log('🔄 [UsersService] Usuario ya existe, actualizando información y vinculando al veterinario.');
            if (!existingUser.createdById) {
                existingUser.createdById = createdById;
            }
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
        const usuarioRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
        const roleId = usuarioRole ? usuarioRole.id : 4;
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
    async findUsuariosByVeterinario(createdById) {
        console.log('🔍 [UsersService] Buscando usuarios registrados por veterinario ID:', createdById);
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
    async findAll() {
        return this.usersRepository.find({
            relations: ['pets', 'role'],
            select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
        });
    }
    async findByRoles(roleNames) {
        const roles = await this.rolesRepository.find({
            where: { name: (0, typeorm_2.In)(roleNames.map(r => r.toLowerCase())) },
        });
        if (!roles.length)
            return [];
        const roleIds = roles.map(r => r.id);
        return this.usersRepository.find({
            where: { roleId: (0, typeorm_2.In)(roleIds) },
            relations: ['pets', 'role'],
            select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
        });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['pets', 'role', 'role.modules'],
            select: ['id', 'username', 'email', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByUsername(identifier) {
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
    async findByEmail(email) {
        return this.usersRepository.findOne({
            where: { email },
            relations: ['pets', 'role'],
            select: ['id', 'username', 'email', 'password', 'fullName', 'firstName', 'lastName', 'phone', 'documentType', 'documentNumber', 'age', 'address', 'avatar', 'roleId', 'isActive', 'createdAt', 'updatedAt'],
        });
    }
    async update(id, updateUserDto) {
        console.log(`🚀 [UsersService] Iniciando actualización para usuario ID: ${id}`);
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['pets', 'role'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        const updateData = { ...updateUserDto };
        if (updateData.username || updateData.email) {
            const existingUser = await this.usersRepository.findOne({
                where: [
                    { username: updateData.username },
                    { email: updateData.email },
                ],
            });
            if (existingUser && existingUser.id !== id) {
                throw new common_1.ConflictException('Username or email already exists');
            }
        }
        if (updateData.password) {
            if (updateData.password.trim().length === 0) {
                console.warn('⚠️ [UsersService] Se recibió una contraseña vacía, ignorando actualización de password.');
                delete updateData.password;
            }
            else {
                console.log(`🔐 [UsersService] Hasheando nueva contraseña para usuario ${user.username}...`);
                updateData.password = await bcrypt.hash(updateData.password, 10);
                console.log('✅ [UsersService] Contraseña hasheada correctamente.');
            }
        }
        delete updateData.id;
        delete updateData.createdAt;
        delete updateData.updatedAt;
        delete updateData.role;
        delete updateData.pets;
        if (Object.keys(updateData).length > 0) {
            console.log(`📝 [UsersService] Campos a actualizar: ${Object.keys(updateData).join(', ')}`);
            const updateResult = await this.usersRepository.update(id, updateData);
            console.log(`✅ [UsersService] Resultado: ${updateResult.affected} fila(s) afectada(s).`);
        }
        else {
            console.log('ℹ️ [UsersService] No hay campos para actualizar.');
        }
        return this.findOne(id);
    }
    async deactivate(id) {
        const user = await this.findOne(id);
        user.isActive = false;
        await this.usersRepository.save(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        permissions_service_1.PermissionsService])
], UsersService);
//# sourceMappingURL=users.service.js.map