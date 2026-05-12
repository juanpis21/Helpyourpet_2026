import { PartialType } from '@nestjs/swagger';
import { CreateConsultaMedicaDto } from './create-consulta-medica.dto';

export class UpdateConsultaMedicaDto extends PartialType(CreateConsultaMedicaDto) {}
