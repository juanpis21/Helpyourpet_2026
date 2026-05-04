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
exports.TokenRecuperacionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = require("crypto");
const token_recuperacion_entity_1 = require("./entities/token-recuperacion.entity");
const users_service_1 = require("../users/users.service");
const mailer_1 = require("@nestjs-modules/mailer");
let TokenRecuperacionService = class TokenRecuperacionService {
    constructor(tokenRepository, usersService, mailerService) {
        this.tokenRepository = tokenRepository;
        this.usersService = usersService;
        this.mailerService = mailerService;
    }
    async solicitarRecuperacion(dto) {
        const usuario = await this.usersService.findByEmail(dto.email);
        if (!usuario) {
            throw new common_1.NotFoundException(`El correo electrónico ${dto.email} no está registrado en la base de datos.`);
        }
        await this.tokenRepository.delete({ usuarioId: usuario.id });
        const nuevoToken = crypto.randomBytes(32).toString('hex');
        const fechaExpiracion = new Date();
        fechaExpiracion.setMinutes(fechaExpiracion.getMinutes() + 10);
        const ticket = this.tokenRepository.create({
            token: nuevoToken,
            usuarioId: usuario.id,
            fechaExpiracion,
        });
        await this.tokenRepository.save(ticket);
        try {
            const urlRecuperacion = `http://localhost:4200/recovery?token=${nuevoToken}`;
            await this.mailerService.sendMail({
                to: usuario.email,
                subject: 'Recuperación de Contraseña - HelpyourPet',
                html: `
          <div style="font-family: Arial, sans-serif; text-align: center; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4CAF50;">Clínica Veterinaria HelpyourPet</h2>
            <p style="font-size: 16px;">Hola <b>${usuario.fullName || usuario.username}</b>,</p>
            <p>Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para continuar:</p>
            <div style="margin: 30px 0;">
              <a href="${urlRecuperacion}" 
                 style="background-color: #2e9e44; color: white; padding: 14px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                 Restablecer mi contraseña
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">Este enlace expirará en 10 minutos por tu seguridad.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #999;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
          </div>
        `,
            });
        }
        catch (e) {
            console.log('Error enviando correo SMTP: ', e.message);
            throw new common_1.InternalServerErrorException('Error enviando correo SMTP: ' + e.message);
        }
        return {
            mensaje: 'Recuperación inicializada con éxito. Revisa tu correo electrónico para continuar.'
        };
    }
    async resetPassword(dto) {
        const ticket = await this.tokenRepository.findOne({ where: { token: dto.token } });
        if (!ticket) {
            throw new common_1.BadRequestException('El Token de Recuperación es inválido o nunca fue creado.');
        }
        const hoy = new Date();
        if (hoy > ticket.fechaExpiracion) {
            await this.tokenRepository.delete(ticket.id);
            throw new common_1.BadRequestException('El Token ha superado sus 10 minutos de vida. Debe solicitar uno nuevo.');
        }
        const usuario = await this.usersService.findOne(ticket.usuarioId);
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario asociado al token ya no existe.');
        }
        await this.usersService.update(usuario.id, { password: dto.nuevaContrasena });
        await this.tokenRepository.delete(ticket.id);
        return { mensaje: 'Contraseña actualizada con éxito!' };
    }
};
exports.TokenRecuperacionService = TokenRecuperacionService;
exports.TokenRecuperacionService = TokenRecuperacionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(token_recuperacion_entity_1.TokenRecuperacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        mailer_1.MailerService])
], TokenRecuperacionService);
//# sourceMappingURL=token-recuperacion.service.js.map