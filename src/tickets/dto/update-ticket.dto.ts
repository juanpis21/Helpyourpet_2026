import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class UpdateTicketDto {
  @ApiProperty({ 
    description: 'Estado del ticket', 
    enum: TicketStatus,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  estado?: TicketStatus;

  @ApiProperty({ 
    description: 'Prioridad del ticket', 
    enum: TicketPriority,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  prioridad?: TicketPriority;

  @ApiProperty({ 
    description: 'Asunto del ticket', 
    required: false,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  asunto?: string;

  @ApiProperty({ 
    description: 'Descripción detallada del ticket', 
    required: false
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
