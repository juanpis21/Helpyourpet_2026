import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { HistoriaClinica } from './historia-clinica.entity';

@Entity('consultas_medicas')
export class ConsultaMedica {
  @ApiProperty({ description: 'ID de la consulta', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_consulta' })
  id: number;

  @ApiProperty({ description: 'ID de la historia clínica', example: 1 })
  @Column({ name: 'id_historia' })
  historiaId: number;

  @ManyToOne(() => HistoriaClinica, (historia) => historia.consultas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_historia' })
  historiaClinica: HistoriaClinica;

  @ApiProperty({ description: 'Fecha y hora de la consulta' })
  @Column({ name: 'fecha_consulta', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaConsulta: Date;

  @ApiProperty({ description: 'Peso del paciente (kg)', example: 12.5 })
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  peso: number;

  @ApiProperty({ description: 'Temperatura del paciente (°C)', example: 38.5 })
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperatura: number;

  @ApiProperty({ description: 'Motivo de la consulta', example: 'Control de rutina' })
  @Column({ name: 'motivo_consulta', type: 'text', nullable: true })
  motivoConsulta: string;

  @ApiProperty({ description: 'Síntomas observados', example: 'Decaimiento y falta de apetito' })
  @Column({ type: 'text', nullable: true })
  sintomas: string;

  @ApiProperty({ description: 'Diagnóstico', example: 'Gastroenteritis leve' })
  @Column({ type: 'text', nullable: true })
  diagnostico: string;

  @ApiProperty({ description: 'Tratamiento indicado', example: 'Dieta blanda por 3 días' })
  @Column({ type: 'text', nullable: true })
  tratamiento: string;

  @ApiProperty({ description: 'Medicamentos recetados', example: 'Metronidazol 250mg, 1 comp cada 12h' })
  @Column({ type: 'text', nullable: true })
  medicamentos: string;

  @ApiProperty({ description: 'Observaciones adicionales de la consulta' })
  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ApiProperty({ description: 'Fecha de próxima cita sugerida', required: false })
  @Column({ name: 'proxima_cita', type: 'date', nullable: true })
  proximaCita: Date;
}
