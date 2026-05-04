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
exports.TokenRecuperacionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const token_recuperacion_service_1 = require("./token-recuperacion.service");
const solicitar_recuperacion_dto_1 = require("./dto/solicitar-recuperacion.dto");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let TokenRecuperacionController = class TokenRecuperacionController {
    constructor(tokenRecuperacionService) {
        this.tokenRecuperacionService = tokenRecuperacionService;
    }
    solicitarRecuperacion(dto) {
        return this.tokenRecuperacionService.solicitarRecuperacion(dto);
    }
    resetPassword(dto) {
        return this.tokenRecuperacionService.resetPassword(dto);
    }
};
exports.TokenRecuperacionController = TokenRecuperacionController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('solicitar'),
    (0, swagger_1.ApiOperation)({ summary: 'Generar token secreto tras olvidar clave' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [solicitar_recuperacion_dto_1.SolicitarRecuperacionDto]),
    __metadata("design:returntype", void 0)
], TokenRecuperacionController.prototype, "solicitarRecuperacion", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('resetear'),
    (0, swagger_1.ApiOperation)({ summary: 'Entregar ticket/token y redefinir la clave' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", void 0)
], TokenRecuperacionController.prototype, "resetPassword", null);
exports.TokenRecuperacionController = TokenRecuperacionController = __decorate([
    (0, swagger_1.ApiTags)('recuperacion-claves'),
    (0, common_1.Controller)('recuperar'),
    __metadata("design:paramtypes", [token_recuperacion_service_1.TokenRecuperacionService])
], TokenRecuperacionController);
//# sourceMappingURL=token-recuperacion.controller.js.map