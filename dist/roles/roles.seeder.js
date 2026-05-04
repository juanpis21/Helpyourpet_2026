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
var RolesSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("./entities/role.entity");
const user_entity_1 = require("../users/entities/user.entity");
const module_entity_1 = require("../modules/entities/module.entity");
let RolesSeeder = RolesSeeder_1 = class RolesSeeder {
    constructor(rolesRepository, usersRepository, moduleRepository) {
        this.rolesRepository = rolesRepository;
        this.usersRepository = usersRepository;
        this.moduleRepository = moduleRepository;
        this.logger = new common_1.Logger(RolesSeeder_1.name);
    }
    async onApplicationBootstrap() {
        const modulesData = [
            { name: 'inicio', description: 'Módulo de inicio' },
            { name: 'sobre-nosotros', description: 'Módulo de sobre nosotros' },
            { name: 'adopcion', description: 'Módulo de adopción' },
            { name: 'tienda', description: 'Módulo de tienda' },
            { name: 'reporte', description: 'Módulo de reportes' },
            { name: 'calificacion', description: 'Módulo de calificaciones' },
            { name: 'veterinario', description: 'Módulo de veterinario' },
            { name: 'servicios', description: 'Módulo de servicios' },
            { name: 'pasarela-pagos', description: 'Módulo de pasarela de pagos' },
            { name: 'perfil-usuario', description: 'Módulo de perfil de usuario' },
            { name: 'perfil-veterinario', description: 'Módulo de perfil de veterinario' },
            { name: 'panel-admin', description: 'Módulo de panel de administrador' },
            { name: 'recovery', description: 'Módulo de recuperación de contraseña' },
            { name: 'publicaciones', description: 'Módulo de publicaciones' },
        ];
        for (const moduleData of modulesData) {
            const existing = await this.moduleRepository.findOne({
                where: { name: moduleData.name },
            });
            if (!existing) {
                await this.moduleRepository.save(this.moduleRepository.create(moduleData));
                this.logger.log(`✅ Módulo creado: "${moduleData.name}"`);
            }
        }
        this.logger.log('Módulos verificados correctamente.');
        const rolesBase = [
            { name: 'admin', description: 'Administrador del sistema' },
            { name: 'usuario', description: 'Usuario estándar de la plataforma' },
            { name: 'veterinario', description: 'Profesional veterinario' },
        ];
        for (const roleData of rolesBase) {
            const existe = await this.rolesRepository.findOne({
                where: { name: roleData.name },
            });
            if (!existe) {
                await this.rolesRepository.save(this.rolesRepository.create(roleData));
                this.logger.log(`✅ Rol creado: "${roleData.name}"`);
            }
        }
        this.logger.log('Roles base verificados correctamente.');
        const allModules = await this.moduleRepository.find();
        const adminRole = await this.rolesRepository.findOne({ where: { name: 'admin' } });
        if (adminRole) {
            const roleWithModules = await this.rolesRepository.findOne({ where: { id: adminRole.id }, relations: ['modules'] });
            if (roleWithModules && roleWithModules.modules.length === 0) {
                roleWithModules.modules = allModules;
                await this.rolesRepository.save(roleWithModules);
                this.logger.log(`✅ Módulos asignados al rol "admin"`);
            }
        }
        const usuarioRole = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
        if (usuarioRole) {
            const roleWithModules = await this.rolesRepository.findOne({ where: { id: usuarioRole.id }, relations: ['modules'] });
            if (roleWithModules) {
                const usuarioModuleNames = ['inicio', 'sobre-nosotros', 'adopcion', 'tienda', 'servicios', 'perfil-usuario', 'calificacion', 'recovery', 'publicaciones'];
                const currentModuleNames = roleWithModules.modules.map(m => m.name);
                roleWithModules.modules = allModules.filter(m => usuarioModuleNames.includes(m.name));
                await this.rolesRepository.save(roleWithModules);
                this.logger.log(`✅ Módulos actualizados al rol "usuario" (incluyendo publicaciones)`);
            }
        }
        const vetRole = await this.rolesRepository.findOne({ where: { name: 'veterinario' } });
        if (vetRole) {
            const roleWithModules = await this.rolesRepository.findOne({ where: { id: vetRole.id }, relations: ['modules'] });
            if (roleWithModules && roleWithModules.modules.length === 0) {
                const vetModuleNames = ['inicio', 'sobre-nosotros', 'adopcion', 'tienda', 'servicios', 'perfil-usuario', 'perfil-veterinario', 'veterinario', 'calificacion', 'recovery'];
                roleWithModules.modules = allModules.filter(m => vetModuleNames.includes(m.name));
                await this.rolesRepository.save(roleWithModules);
                this.logger.log(`✅ Módulos asignados al rol "veterinario"`);
            }
        }
        const rolUsuario = await this.rolesRepository.findOne({ where: { name: 'usuario' } });
        if (!rolUsuario)
            return;
        const usuariosSinRol = await this.usersRepository.find({
            where: { roleId: null },
        });
        let asignados = 0;
        for (const user of usuariosSinRol) {
            user.roleId = rolUsuario.id;
            await this.usersRepository.save(user);
            asignados++;
        }
        if (asignados > 0) {
            this.logger.log(`🔑 Se asignó el rol "usuario" a ${asignados} usuario(s) sin rol.`);
        }
    }
};
exports.RolesSeeder = RolesSeeder;
exports.RolesSeeder = RolesSeeder = RolesSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RolesSeeder);
//# sourceMappingURL=roles.seeder.js.map