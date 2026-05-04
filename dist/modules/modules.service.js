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
exports.ModulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const module_entity_1 = require("./entities/module.entity");
const role_entity_1 = require("../roles/entities/role.entity");
let ModulesService = class ModulesService {
    constructor(moduleRepository, roleRepository) {
        this.moduleRepository = moduleRepository;
        this.roleRepository = roleRepository;
    }
    async onModuleInit() {
        console.log('🚀 [ModulesService] Inicializando módulos y roles del sistema...');
        await this.createInitialModules();
    }
    async findAll() {
        return this.moduleRepository.find({
            relations: ['roles'],
        });
    }
    async findOne(id) {
        return this.moduleRepository.findOne({
            where: { id },
            relations: ['roles'],
        });
    }
    async findByName(name) {
        return this.moduleRepository.findOne({
            where: { name },
            relations: ['roles'],
        });
    }
    async createInitialModules() {
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
        const createdModules = [];
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
        const rolesToCreate = [
            { name: 'SUPERADMIN', description: 'Super Administrador con acceso total al sistema' },
            { name: 'ADMIN', description: 'Administrador de veterinaria con acceso a gestión' },
            { name: 'VETERINARIO', description: 'Personal médico veterinario' },
            { name: 'USUARIO', description: 'Usuario estándar del sistema (dueño de mascota)' }
        ];
        for (const roleData of rolesToCreate) {
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
            if (role.name.toLowerCase() === 'superadmin') {
                role.modules = createdModules;
                await this.roleRepository.save(role);
                console.log(`🔒 [ModulesService] Permisos totales asignados a: ${role.name}`);
            }
        }
        return createdModules;
    }
    async assignModulesToRole(roleId, moduleNames) {
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
        return this.roleRepository.save(role);
    }
};
exports.ModulesService = ModulesService;
exports.ModulesService = ModulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(module_entity_1.Module)),
    __param(1, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ModulesService);
//# sourceMappingURL=modules.service.js.map