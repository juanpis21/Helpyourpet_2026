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
exports.PermissionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const permissions_service_1 = require("./permissions.service");
const permission_entity_1 = require("./entities/permission.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let PermissionsController = class PermissionsController {
    constructor(permissionsService) {
        this.permissionsService = permissionsService;
    }
    async getUserPermissions(userId) {
        return this.permissionsService.findByUserId(+userId);
    }
    async getMyPermissions(req) {
        return this.permissionsService.findByUserId(req.user.userId);
    }
    async checkPermission(req, moduleName) {
        const hasAccess = await this.permissionsService.hasPermission(req.user.userId, moduleName, 'canAccess');
        return { hasAccess };
    }
    async createDefaultPermissions(userId) {
        return this.permissionsService.createDefaultPermissions(+userId);
    }
    async updatePermission(userId, moduleName, updates) {
        return this.permissionsService.updatePermission(+userId, moduleName, updates);
    }
    async grantModuleAccess(userId, body) {
        return this.permissionsService.grantModuleAccess(+userId, body.moduleNames);
    }
    async revokeModuleAccess(userId, body) {
        return this.permissionsService.revokeModuleAccess(+userId, body.moduleNames);
    }
};
exports.PermissionsController = PermissionsController;
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener permisos de un usuario' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getUserPermissions", null);
__decorate([
    (0, common_1.Get)('my-permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener mis permisos' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "getMyPermissions", null);
__decorate([
    (0, common_1.Get)('check/:moduleName'),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar si tengo acceso a un módulo' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('moduleName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.Post)('default/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear permisos por defecto para un usuario' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "createDefaultPermissions", null);
__decorate([
    (0, common_1.Put)('update/:userId/:moduleName'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar permiso de un módulo' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('moduleName')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.Post)('grant/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Otorgar acceso a módulos' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "grantModuleAccess", null);
__decorate([
    (0, common_1.Post)('revoke/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Revocar acceso a módulos' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PermissionsController.prototype, "revokeModuleAccess", null);
exports.PermissionsController = PermissionsController = __decorate([
    (0, swagger_1.ApiTags)('permissions'),
    (0, common_1.Controller)('permissions'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [permissions_service_1.PermissionsService])
], PermissionsController);
//# sourceMappingURL=permissions.controller.js.map