import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  STATUS_CHANGE = 'STATUS_CHANGE',
}

@Entity('audit_logs')
export class AuditLog {
  @ApiProperty({ description: 'ID único del registro de auditoría', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID del usuario que realizó la acción', example: 1 })
  @Column({ name: 'userId' })
  userId: number;

  @ApiProperty({ description: 'Usuario que realizó la acción', type: () => User })
  @ManyToOne(() => User, user => user.id)
  user: User;

  @ApiProperty({ description: 'Tipo de acción', enum: AuditAction, example: AuditAction.CREATE })
  @Column({ length: 20, enum: AuditAction })
  action: AuditAction;

  @ApiProperty({ description: 'Entidad afectada', example: 'User' })
  @Column({ length: 50 })
  entity: string;

  @ApiProperty({ description: 'ID del registro afectado', example: 1 })
  @Column({ name: 'entityId' })
  entityId: number;

  @ApiProperty({ description: 'Descripción legible de la acción', example: 'Admin Juan creó al usuario Pedro' })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Valor anterior (para updates)', required: false })
  @Column({ type: 'simple-json', nullable: true })
  oldValue?: any;

  @ApiProperty({ description: 'Valor nuevo (para updates/creates)', required: false })
  @Column({ type: 'simple-json', nullable: true })
  newValue?: any;

  @ApiProperty({ description: 'Fecha y hora de la acción', example: '2026-05-15T21:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}
