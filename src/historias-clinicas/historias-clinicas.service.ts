import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoriaClinica } from './entities/historia-clinica.entity';
import { ConsultaMedica } from './entities/consulta-medica.entity';
import { CreateHistoriaClinicaDto } from './dto/create-historia-clinica.dto';
import { UpdateHistoriaClinicaDto } from './dto/update-historia-clinica.dto';
import { CreateConsultaMedicaDto } from './dto/create-consulta-medica.dto';
import { PetsService } from '../pets/pets.service';

@Injectable()
export class HistoriasClinicasService {
  constructor(
    @InjectRepository(HistoriaClinica)
    private historiaRepo: Repository<HistoriaClinica>,
    @InjectRepository(ConsultaMedica)
    private consultaRepo: Repository<ConsultaMedica>,
    private petsService: PetsService,
  ) {}

  // ─── HISTORIA CLÍNICA ────────────────────────────────────────────────────────

  async findOrCreateByMascota(mascotaId: number): Promise<HistoriaClinica> {
    const existing = await this.historiaRepo.findOne({
      where: { mascotaId },
      relations: ['mascota', 'mascota.owner', 'consultas'],
    });
    if (existing) return existing;

    // Verificar que la mascota exista
    await this.petsService.findOne(mascotaId);

    const nueva = this.historiaRepo.create({ mascotaId });
    return this.historiaRepo.save(nueva);
  }

  async findByMascota(mascotaId: number): Promise<HistoriaClinica | null> {
    return this.historiaRepo.findOne({
      where: { mascotaId },
      relations: ['mascota', 'mascota.owner', 'consultas'],
      order: { fechaApertura: 'DESC' } as any,
    });
  }

  async create(dto: CreateHistoriaClinicaDto): Promise<HistoriaClinica> {
    await this.petsService.findOne(dto.mascotaId);
    const historia = this.historiaRepo.create(dto);
    return this.historiaRepo.save(historia);
  }

  async findAll(): Promise<HistoriaClinica[]> {
    return this.historiaRepo.find({
      relations: ['mascota', 'mascota.owner', 'consultas'],
      order: { fechaApertura: 'DESC' } as any,
    });
  }

  async findOne(id: number): Promise<HistoriaClinica> {
    const historia = await this.historiaRepo.findOne({
      where: { id },
      relations: ['mascota', 'mascota.owner', 'consultas'],
    });
    if (!historia) {
      throw new NotFoundException(`Historia clínica con ID ${id} no encontrada.`);
    }
    return historia;
  }

  async update(id: number, dto: UpdateHistoriaClinicaDto): Promise<HistoriaClinica> {
    const historia = await this.findOne(id);
    Object.assign(historia, dto);
    return this.historiaRepo.save(historia);
  }

  async remove(id: number): Promise<void> {
    const historia = await this.findOne(id);
    await this.historiaRepo.delete(historia.id);
  }

  // ─── CONSULTAS MÉDICAS ───────────────────────────────────────────────────────

  async createConsulta(dto: CreateConsultaMedicaDto): Promise<ConsultaMedica> {
    // Asegurar que la historia existe
    await this.findOne(dto.historiaId);
    const consulta = this.consultaRepo.create(dto);
    return this.consultaRepo.save(consulta);
  }

  async findConsultasByHistoria(historiaId: number): Promise<ConsultaMedica[]> {
    return this.consultaRepo.find({
      where: { historiaId },
      order: { fechaConsulta: 'DESC' },
    });
  }

  async findOneConsulta(id: number): Promise<ConsultaMedica> {
    const consulta = await this.consultaRepo.findOne({ where: { id } });
    if (!consulta) throw new NotFoundException(`Consulta con ID ${id} no encontrada.`);
    return consulta;
  }

  async removeConsulta(id: number): Promise<void> {
    await this.findOneConsulta(id);
    await this.consultaRepo.delete(id);
  }
}
