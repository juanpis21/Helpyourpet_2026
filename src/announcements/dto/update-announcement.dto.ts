import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDate, MinLength, MaxLength, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateAnnouncementDto {
  @ApiProperty({ 
    description: 'Título del anuncio', 
    required: false,
    minLength: 5,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  titulo?: string;

  @ApiProperty({ 
    description: 'Mensaje del anuncio', 
    required: false,
    minLength: 10
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  mensaje?: string;

  @ApiProperty({ 
    description: 'Fecha de expiración del anuncio', 
    required: false
  })
  @IsOptional()
  @ValidateIf((o) => o.fechaExpiracion !== null)
  @Type(() => Date)
  @IsDate()
  fechaExpiracion?: Date | null;

  @ApiProperty({ 
    description: '¿Está activo el anuncio?', 
    required: false
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
