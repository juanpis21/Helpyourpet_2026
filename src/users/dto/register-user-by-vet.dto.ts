import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterUserByVetDto {
  @ApiProperty({ 
    description: 'Nombres', 
    example: 'Juan Carlos'
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    description: 'Apellidos', 
    example: 'Pérez García'
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    description: 'Teléfono', 
    example: '+1234567890',
    required: false,
    maxLength: 20
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ 
    description: 'Tipo de documento', 
    example: 'Cédula'
  })
  @IsString()
  documentType: string;

  @ApiProperty({ 
    description: 'Número de documento', 
    example: '12345678'
  })
  @IsString()
  documentNumber: string;

  @ApiProperty({ 
    description: 'Edad', 
    example: 25,
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  age?: number;

  @ApiProperty({ 
    description: 'Dirección', 
    example: 'Calle 123 #45-67',
    required: false
  })
  @IsOptional()
  @IsString()
  address?: string;
}
