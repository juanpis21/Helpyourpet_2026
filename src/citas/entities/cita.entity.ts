import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Pet } from '../../pets/entities/pet.entity';
import { Role } from '../../roles/entities/role.entity';
import { HistorialCita } from '../../historial-citas/entities/historial-cita.entity';
import { Servicio } from '../../servicios/entities/servicio.entity';
import { Veterinaria } from '../../veterinarias/entities/veterinaria.entity';

@Entity('citas')
export class Cita {
  @ApiProperty({ 
    description: 'ID único de la cita', 
    example: 1 
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ 
    description: 'Motivo de la cita', 
    example: 'Control general y vacunación' 
  })
  @Column({ length: 500 })
  motivo: string;

  @ApiProperty({ 
    description: 'Fecha y hora de la cita', 
    example: '2026-03-20T10:30:00.000Z' 
  })
  @Column({
    type: 'timestamp',
    transformer: {
      to: (value: Date) => {
        if (!value) return value;
        // Postgres expects 'YYYY-MM-DD HH:mm:ss'
        // By passing the UTC string representation, we avoid the pg driver formatting it in local time
        return value.toISOString().replace('T', ' ').substring(0, 19);
      },
      from: (value: any) => value
    }
  })
  fechaHora: Date;

  @ApiProperty({ 
    description: 'Estado de la cita', 
    example: 'Programada',
    enum: ['Programada', 'En curso', 'Completada', 'Cancelada']
  })
  @Column({ 
    length: 20, 
    default: 'Programada',
    enum: ['Programada', 'En curso', 'Completada', 'Cancelada']
  })
  estado: string;

  @ApiProperty({ 
    description: 'Usuario que solicita la cita', 
    type: () => User 
  })
  @ManyToOne(() => User, user => user.citas)
  usuario: User;

  @ApiProperty({ 
    description: 'Veterinario asignado a la cita', 
    type: () => User,
    required: false
  })
  @ManyToOne(() => User, user => user.citasAsignadas)
  veterinario: User;

  @ApiProperty({ 
    description: 'Mascota del paciente', 
    type: () => Pet 
  })
  @ManyToOne(() => Pet, pet => pet.citas)
  mascota: Pet;

  @ApiProperty({ 
    description: 'Servicio asociado a la cita', 
    type: () => Servicio,
    required: false
  })
  @ManyToOne(() => Servicio, { nullable: true })
  servicio?: Servicio;

  @ApiProperty({ 
    description: 'Veterinaria asociada a la cita', 
    type: () => Veterinaria,
    required: false
  })
  @ManyToOne(() => Veterinaria, { nullable: true })
  veterinaria?: Veterinaria;

  @ApiProperty({ 
    description: 'Historial de cambios de esta cita', 
    type: () => [HistorialCita] 
  })
  @OneToMany(() => HistorialCita, historialCita => historialCita.cita)
  historial: HistorialCita[];

  @ApiProperty({ 
    description: 'Indica si la cita está activa en el sistema', 
    example: true 
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    description: 'Fecha de creación del registro', 
    example: '2026-03-19T20:00:00.000Z' 
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ 
    description: 'Fecha de última actualización', 
    example: '2026-03-19T20:00:00.000Z' 
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
