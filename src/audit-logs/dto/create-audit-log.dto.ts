import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { AuditAction } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @ApiProperty({ description: 'ID del usuario que realizó la acción', example: 1 })
  @IsNumber()
  userId: number;

  @ApiProperty({ description: 'Tipo de acción', enum: AuditAction, example: AuditAction.CREATE })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ description: 'Entidad afectada', example: 'User' })
  @IsString()
  entity: string;

  @ApiProperty({ description: 'ID del registro afectado', example: 1 })
  @IsNumber()
  entityId: number;

  @ApiProperty({ description: 'Descripción legible de la acción', example: 'Admin Juan creó al usuario Pedro' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Valor anterior (para updates)', required: false })
  @IsOptional()
  oldValue?: any;

  @ApiProperty({ description: 'Valor nuevo (para updates/creates)', required: false })
  @IsOptional()
  newValue?: any;
}
