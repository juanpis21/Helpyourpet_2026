import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TokenRecuperacionService } from './token-recuperacion.service';
import { SolicitarRecuperacionDto } from './dto/solicitar-recuperacion.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { TestEmailDto } from './dto/test-email.dto';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('recuperacion-claves')
@Controller('recuperar')
export class TokenRecuperacionController {
  constructor(private readonly tokenRecuperacionService: TokenRecuperacionService) {}

  @Public() // Debe ser público porque el que lo usa olvidó cómo entrar.
  @Post('solicitar')
  @ApiOperation({ summary: 'Generar token secreto tras olvidar clave' })
  solicitarRecuperacion(@Body() dto: SolicitarRecuperacionDto) {
    return this.tokenRecuperacionService.solicitarRecuperacion(dto);
  }

  @Public()
  @Post('resetear')
  @ApiOperation({ summary: 'Entregar ticket/token y redefinir la clave' })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.tokenRecuperacionService.resetPassword(dto);
  }

  @Public()
  @Post('test-email')
  @ApiOperation({ summary: 'Enviar correo de prueba para depuración SMTP' })
  testEmail(@Body() dto: TestEmailDto) {
    return this.tokenRecuperacionService.sendTestEmail(dto.email, dto.subject);
  }
}
