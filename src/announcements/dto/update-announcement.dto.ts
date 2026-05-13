import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDate, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAnnouncementDto {
  @ApiProperty({ 
    description: 'Título del anuncio', 
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  titulo?: string;

  @ApiProperty({ 
    description: 'Mensaje del anuncio', 
    required: false
  })
  @IsOptional()
  @IsString()
  mensaje?: string;

  @ApiProperty({ 
    description: 'Fecha de expiración del anuncio', 
    required: false
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaExpiracion?: Date;

  @ApiProperty({ 
    description: '¿Está activo el anuncio?', 
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
