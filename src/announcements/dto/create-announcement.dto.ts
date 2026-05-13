import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDate, MinLength, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAnnouncementDto {
  @ApiProperty({ 
    description: 'Título del anuncio', 
    example: 'Mantenimiento programado',
    minLength: 5,
    maxLength: 100
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  titulo: string;

  @ApiProperty({ 
    description: 'Mensaje del anuncio', 
    example: 'El sistema estará en mantenimiento el domingo de 2am a 4am...',
    minLength: 10
  })
  @IsString()
  @MinLength(10)
  mensaje: string;

  @ApiProperty({ 
    description: 'Fecha de expiración del anuncio', 
    required: false,
    example: '2026-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaExpiracion?: Date;

  @ApiProperty({ 
    description: '¿Está activo el anuncio?', 
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
