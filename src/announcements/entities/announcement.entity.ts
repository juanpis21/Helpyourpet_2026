import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('announcements')
export class Announcement {
  @ApiProperty({ description: 'ID del anuncio' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Título del anuncio', example: 'Mantenimiento programado' })
  @Column()
  titulo: string;

  @ApiProperty({ description: 'Mensaje del anuncio' })
  @Column('text')
  mensaje: string;

  @ApiProperty({ description: 'Fecha de expiración del anuncio', required: false })
  @Column({ nullable: true })
  fechaExpiracion: Date;

  @ApiProperty({ description: '¿Está activo el anuncio?', default: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha de creación del anuncio' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @UpdateDateColumn()
  updatedAt: Date;
}
