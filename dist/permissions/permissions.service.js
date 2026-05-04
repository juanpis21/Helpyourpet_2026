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
exports.PermissionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const permission_entity_1 = require("./entities/permission.entity");
let PermissionsService = class PermissionsService {
    constructor(permissionRepository) {
        this.permissionRepository = permissionRepository;
    }
    async findByUserId(userId) {
        return this.permissionRepository.find({
            where: { userId },
            select: ['id', 'moduleName', 'canAccess', 'canCreate', 'canRead', 'canUpdate', 'canDelete'],
        });
    }
    async hasPermission(userId, moduleName, action = 'canAccess') {
        const permission = await this.permissionRepository.findOne({
            where: { userId, moduleName },
            select: ['canAccess', 'canCreate', 'canRead', 'canUpdate', 'canDelete'],
        });
        if (!permission) {
            return false;
        }
        return permission[action];
    }
    async createDefaultPermissions(userId) {
        const defaultModules = [
            permission_entity_1.ModuleName.INICIO,
            permission_entity_1.ModuleName.PERFIL_USUARIO,
            permission_entity_1.ModuleName.RECOVERY,
        ];
        const permissions = [];
        for (const moduleName of defaultModules) {
            const permission = this.permissionRepository.create({
                userId,
                moduleName,
                canAccess: true,
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true,
            });
            permissions.push(await this.permissionRepository.save(permission));
        }
        return permissions;
    }
    async updatePermission(userId, moduleName, updates) {
        const permission = await this.permissionRepository.findOne({
            where: { userId, moduleName },
        });
        if (!permission) {
            const newPermission = this.permissionRepository.create({
                userId,
                moduleName,
                ...updates,
            });
            return this.permissionRepository.save(newPermission);
        }
        Object.assign(permission, updates);
        return this.permissionRepository.save(permission);
    }
    async grantModuleAccess(userId, moduleNames) {
        for (const moduleName of moduleNames) {
            const existing = await this.permissionRepository.findOne({
                where: { userId, moduleName },
            });
            if (!existing) {
                const permission = this.permissionRepository.create({
                    userId,
                    moduleName,
                    canAccess: true,
                    canCreate: true,
                    canRead: true,
                    canUpdate: true,
                    canDelete: true,
                });
                await this.permissionRepository.save(permission);
            }
            else {
                existing.canAccess = true;
                await this.permissionRepository.save(existing);
            }
        }
    }
    async revokeModuleAccess(userId, moduleNames) {
        for (const moduleName of moduleNames) {
            const permission = await this.permissionRepository.findOne({
                where: { userId, moduleName },
            });
            if (permission) {
                permission.canAccess = false;
                await this.permissionRepository.save(permission);
            }
        }
    }
};
exports.PermissionsService = PermissionsService;
exports.PermissionsService = PermissionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(permission_entity_1.Permission)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PermissionsService);
//# sourceMappingURL=permissions.service.js.map