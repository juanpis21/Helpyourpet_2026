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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const permissions_service_1 = require("../permissions/permissions.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService, permissionsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.permissionsService = permissionsService;
    }
    async validateUser(username, password) {
        console.log(`🔍 [AuthService] Intentando validar usuario: ${username}`);
        const user = await this.usersService.findByUsername(username);
        if (!user) {
            console.warn(`❌ [AuthService] Usuario no encontrado: ${username}`);
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            console.log(`✅ [AuthService] Usuario validado con éxito: ${username}`);
            const { password, ...result } = user;
            return result;
        }
        console.warn(`❌ [AuthService] Contraseña incorrecta para el usuario: ${username}`);
        return null;
    }
    async login(loginDto) {
        const { username, password } = loginDto;
        const user = await this.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Su cuenta está desactivada. Por favor, contacte al soporte.');
        }
        const payload = {
            username: user.username,
            sub: user.id,
            role: user.role ?? 'usuario'
        };
        const userWithRoles = await this.usersService.findOne(user.id);
        return {
            access_token: this.jwtService.sign(payload),
            user: userWithRoles,
        };
    }
    async checkStatus(user) {
        const userWithRoles = await this.usersService.findOne(user.id);
        return {
            access_token: '',
            user: userWithRoles,
        };
    }
    async verifyPassword(userId, password) {
        try {
            const user = await this.usersService.findOne(userId);
            if (!user || !user.password) {
                return false;
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            return isPasswordValid;
        }
        catch (error) {
            console.error('❌ [AuthService] Error al verificar contraseña:', error);
            return false;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        permissions_service_1.PermissionsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map