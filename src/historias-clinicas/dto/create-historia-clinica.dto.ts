import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateHistoriaClinicaDto {
  @ApiProperty({ example: 1, description: 'ID de la mascota' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  mascotaId: number;

  @ApiProperty({ example: 'Polen, amoxiciland', required: false })
  @IsString()
  @IsOptional()
  alergias?: string;

  @ApiProperty({ example: 'Cirugía de cadera 2024', required: false })
  @IsString()
  @IsOptional()
  antecedentes?: string;

  @ApiProperty({ example: 'Rabia 2025, Parvovirus 2025', required: false })
  @IsString()
  @IsOptional()
  vacunas?: string;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  esterilizado?: boolean;

  @ApiProperty({ example: 'Paciente dócil, sin problemas de comportamiento', required: false })
  @IsString()
  @IsOptional()
  observaciones_generales?: string;
}
