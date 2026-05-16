import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({ 
    description: 'Nombre de la categoría', 
    example: 'Antiparasitarios' 
  })
  @IsString()
  nombre: string;

  @ApiProperty({ 
    description: 'Descripción de la categoría', 
    example: 'Medicamentos para control de parásitos internos y externos',
    required: false
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Código de la categoría', 
    example: 'ANTI-001' 
  })
  @IsString()
  codigo: string;

  @ApiProperty({ 
    description: 'Color para identificar la categoría', 
    example: '#FF6B6B',
    required: false
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ 
    description: 'Indica si la categoría está activa', 
    example: true 
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({ 
    description: 'ID de la veterinaria asociada', 
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  veterinariaId: number;
}
