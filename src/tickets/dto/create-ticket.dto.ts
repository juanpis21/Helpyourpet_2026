import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, MinLength, MaxLength } from 'class-validator';
import { TicketStatus, TicketPriority } from '../entities/ticket.entity';

export class CreateTicketDto {
  @ApiProperty({ 
    description: 'Asunto del ticket', 
    example: 'Problema con mi mascota',
    minLength: 5,
    maxLength: 100
  })
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  asunto: string;

  @ApiProperty({ 
    description: 'Descripción detallada del ticket', 
    example: 'Mi mascota no come desde hace 2 días...',
    minLength: 10
  })
  @IsString()
  @MinLength(10)
  descripcion: string;

  @ApiProperty({ 
    description: 'Prioridad del ticket', 
    enum: TicketPriority,
    example: TicketPriority.MEDIA,
    required: false
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  prioridad?: TicketPriority;
}
