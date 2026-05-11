import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateConsultaMedicaDto {
  @ApiProperty({ example: 1, description: 'ID de la historia clínica' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  historiaId: number;

  @ApiProperty({ example: '2026-05-11T14:00:00', required: false })
  @IsDateString()
  @IsOptional()
  fechaConsulta?: string;

  @ApiProperty({ example: 12.5, description: 'Peso en kg', required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value !== undefined ? Number(value) : undefined)
  peso?: number;

  @ApiProperty({ example: 38.5, description: 'Temperatura en °C', required: false })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => value !== undefined ? Number(value) : undefined)
  temperatura?: number;

  @ApiProperty({ example: 'Control de rutina', required: false })
  @IsString()
  @IsOptional()
  motivoConsulta?: string;

  @ApiProperty({ example: 'Decaimiento y falta de apetito', required: false })
  @IsString()
  @IsOptional()
  sintomas?: string;

  @ApiProperty({ example: 'Gastroenteritis leve', required: false })
  @IsString()
  @IsOptional()
  diagnostico?: string;

  @ApiProperty({ example: 'Dieta blanda por 3 días', required: false })
  @IsString()
  @IsOptional()
  tratamiento?: string;

  @ApiProperty({ example: 'Metronidazol 250mg cada 12h', required: false })
  @IsString()
  @IsOptional()
  medicamentos?: string;

  @ApiProperty({ example: 'Paciente respondió bien al tratamiento', required: false })
  @IsString()
  @IsOptional()
  observaciones?: string;

  @ApiProperty({ example: '2026-06-11', description: 'Fecha próxima cita (YYYY-MM-DD)', required: false })
  @IsDateString()
  @IsOptional()
  proximaCita?: string;
}
