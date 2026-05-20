import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDate, MinLength, MaxLength, ValidateIf, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Type } from 'class-transformer';

function IsAfterNow(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isAfterNow',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true;
          return value instanceof Date && value.getTime() > Date.now();
        },
        defaultMessage(args: ValidationArguments) {
          return 'La fecha de expiración debe ser futura';
        },
      },
    });
  };
}

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
    description: 'Fecha de expiración del anuncio (debe ser futura)', 
    required: false,
    example: '2026-12-31T23:59:59.000Z'
  })
  @IsOptional()
  @ValidateIf((o) => o.fechaExpiracion !== null)
  @Type(() => Date)
  @IsDate()
  @IsAfterNow({ message: 'La fecha de expiración debe ser futura' })
  fechaExpiracion?: Date | null;

  @ApiProperty({ 
    description: '¿Está activo el anuncio?', 
    required: false,
    default: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
