import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum TicketStatus {
  ABIERTO = 'Abierto',
  EN_PROCESO = 'En Proceso',
  CERRADO = 'Cerrado'
}

export enum TicketPriority {
  BAJA = 'Baja',
  MEDIA = 'Media',
  ALTA = 'Alta'
}

@Entity('tickets')
export class Ticket {
  @ApiProperty({ description: 'ID del ticket' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Asunto del ticket', example: 'Problema con mi mascota' })
  @Column()
  asunto: string;

  @ApiProperty({ description: 'Descripción detallada del ticket' })
  @Column('text')
  descripcion: string;

  @ApiProperty({ description: 'Estado del ticket', enum: TicketStatus, example: TicketStatus.ABIERTO })
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.ABIERTO
  })
  estado: TicketStatus;

  @ApiProperty({ description: 'Prioridad del ticket', enum: TicketPriority, example: TicketPriority.MEDIA })
  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIA
  })
  prioridad: TicketPriority;

  @ApiProperty({ description: 'ID del usuario que creó el ticket' })
  @Column()
  userId: number;

  @ApiProperty({ description: 'Usuario que creó el ticket', type: () => User })
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Fecha de creación del ticket' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
