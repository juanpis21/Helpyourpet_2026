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
exports.VeterinarioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const register_user_by_vet_dto_1 = require("./dto/register-user-by-vet.dto");
const user_entity_1 = require("./entities/user.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let VeterinarioController = class VeterinarioController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async registerUser(registerDto, req) {
        const user = req.user;
        if (user.roleId !== 3) {
            throw new common_1.ForbiddenException('Solo los veterinarios pueden registrar usuarios de esta forma.');
        }
        return this.usersService.registerByVeterinario(registerDto, user.userId);
    }
    async getUsuariosSinCuenta(req) {
        const user = req.user;
        if (user.roleId !== 3) {
            throw new common_1.ForbiddenException('Solo los veterinarios pueden ver esta lista.');
        }
        return this.usersService.findUsuariosByVeterinario(user.userId);
    }
};
exports.VeterinarioController = VeterinarioController;
__decorate([
    (0, common_1.Post)('registrar-usuario'),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un nuevo dueño de mascota (solo veterinarios)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario registrado exitosamente o retornado el existente', type: user_entity_1.User }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Acceso denegado. Solo veterinarios pueden realizar esta acción.' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_user_by_vet_dto_1.RegisterUserByVetDto, Object]),
    __metadata("design:returntype", Promise)
], VeterinarioController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Get)('usuarios'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener usuarios sin cuenta activa registrados por veterinarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios sin cuenta', type: [user_entity_1.User] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], VeterinarioController.prototype, "getUsuariosSinCuenta", null);
exports.VeterinarioController = VeterinarioController = __decorate([
    (0, swagger_1.ApiTags)('veterinario'),
    (0, common_1.Controller)('veterinario'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], VeterinarioController);
//# sourceMappingURL=veterinario.controller.js.map