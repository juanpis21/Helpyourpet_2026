import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity';

@Entity('historias_clinicas')
export class HistoriaClinica {
  @ApiProperty({ description: 'ID de la Historia Clínica', example: 1 })
  @PrimaryGeneratedColumn({ name: 'id_historia' })
  id: number;

  @ApiProperty({ description: 'ID de la mascota', example: 1 })
  @Column({ name: 'id_mascota', unique: true })
  mascotaId: number;

  @ManyToOne(() => Pet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_mascota' })
  mascota: Pet;

  @ApiProperty({ description: 'Alergias conocidas', example: 'Alérgica al amoxiland' })
  @Column({ type: 'text', nullable: true })
  alergias: string;

  @ApiProperty({ description: 'Antecedentes médicos', example: 'Cirugía de cadera 2024' })
  @Column({ type: 'text', nullable: true })
  antecedentes: string;

  @ApiProperty({ description: 'Vacunas aplicadas', example: 'Rabia, Parvovirus, Moquillo' })
  @Column({ type: 'text', nullable: true })
  vacunas: string;

  @ApiProperty({ description: '¿Está esterilizado/a?', example: false })
  @Column({ type: 'boolean', default: false })
  esterilizado: boolean;

  @ApiProperty({ description: 'Observaciones generales', example: 'Paciente tranquilo' })
  @Column({ type: 'text', nullable: true })
  observaciones_generales: string;

  @ApiProperty({ description: 'Fecha de apertura del expediente' })
  @CreateDateColumn({ name: 'fecha_apertura', type: 'date' })
  fechaApertura: Date;

  @OneToMany('ConsultaMedica', 'historiaClinica')
  consultas: any[];
}
