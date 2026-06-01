import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { UsersService } from '../users/users.service';
import { PetsService } from '../pets/pets.service';
import { HistorialCitasService } from '../historial-citas/historial-citas.service';
import { PerfilVeterinario } from '../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Servicio } from '../servicios/entities/servicio.entity';
import { Veterinaria } from '../veterinarias/entities/veterinaria.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private citasRepository: Repository<Cita>,
    @InjectRepository(PerfilVeterinario)
    private perfilesVetRepository: Repository<PerfilVeterinario>,
    @InjectRepository(Servicio)
    private serviciosRepository: Repository<Servicio>,
    @InjectRepository(Veterinaria)
    private veterinariasRepository: Repository<Veterinaria>,
    private usersService: UsersService,
    private petsService: PetsService,
    @Inject(forwardRef(() => HistorialCitasService))
    private historialCitasService: HistorialCitasService,
  ) { }

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {

    const usuario = await this.usersService.findOne(createCitaDto.usuarioId);
    if (!usuario) {
      throw new NotFoundException(`Usuario with ID ${createCitaDto.usuarioId} not found`);
    }

    const mascota = await this.petsService.findOne(createCitaDto.mascotaId);
    if (!mascota) {
      throw new NotFoundException(`Mascota with ID ${createCitaDto.mascotaId} not found`);
    }

    if (mascota.ownerId !== createCitaDto.usuarioId) {
      throw new ConflictException('La mascota no pertenece al usuario especificado');
    }

    const fechaHora = new Date(createCitaDto.fechaHora);

    if (fechaHora <= new Date()) {
      throw new ConflictException('La fecha de la cita debe ser futura');
    }

    // Buscar el veterinario si se proporciona ID
    let veterinario = null;
    if (createCitaDto.idVeterinario) {
      veterinario = await this.usersService.findOne(createCitaDto.idVeterinario);
    }

    // Buscar el servicio si se proporciona ID
    let servicio = null;
    if (createCitaDto.servicioId) {
      servicio = await this.serviciosRepository.findOne({ where: { id: createCitaDto.servicioId } });
    }

    // Buscar la veterinaria si se proporciona ID
    let veterinaria = null;
    if (createCitaDto.veterinariaId) {
      veterinaria = await this.veterinariasRepository.findOne({ where: { id: createCitaDto.veterinariaId } });
    }

    const existingCita = await this.citasRepository.findOne({
      where: {
        mascota: { id: createCitaDto.mascotaId },
        fechaHora: fechaHora
      },
      relations: ['mascota']
    });

    if (existingCita) {
      throw new ConflictException('Ya existe una cita para esta mascota en el mismo horario');
    }

    const cita = this.citasRepository.create({
      ...createCitaDto,
      fechaHora,
      usuario,
      mascota,
      veterinario,
      servicio,
      veterinaria,
    });

    const savedCita = await this.citasRepository.save(cita);

    await this.historialCitasService.registrarCreacionCita(
      savedCita.id,
      createCitaDto.usuarioId,
      `Se creó la cita para ${mascota.name} el ${fechaHora.toISOString()}`
    );

    return savedCita;
  }

  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { isActive: true },
      relations: ['usuario', 'mascota', 'veterinario', 'servicio', 'veterinaria'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citasRepository.findOne({
      where: { id, isActive: true },
      relations: ['usuario', 'mascota', 'veterinario', 'servicio', 'veterinaria'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });

    if (!cita) {
      throw new NotFoundException(`Cita with ID ${id} not found`);
    }

    return cita;
  }

  async findByVeterinario(veterinarioId: number): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { 
        veterinario: { id: veterinarioId },
        isActive: true 
      },
      relations: ['usuario', 'mascota', 'veterinario', 'servicio', 'veterinaria'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });
  }

  async findByUsuario(usuarioId: number): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario', 'mascota', 'veterinario', 'servicio', 'veterinaria'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
      order: { fechaHora: 'ASC' }
    });
  }

  async findByMascota(mascotaId: number): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { mascota: { id: mascotaId } },
      relations: ['usuario', 'mascota', 'veterinario', 'servicio', 'veterinaria'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
      order: { fechaHora: 'ASC' }
    });
  }

  async findByEstado(estado: string): Promise<Cita[]> {
    return this.citasRepository.find({
      where: { estado, isActive: true },
      relations: ['usuario', 'mascota', 'veterinario', 'servicio', 'veterinaria'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
      order: { fechaHora: 'ASC' }
    });
  }

  async findByFecha(fecha: string): Promise<Cita[]> {
    const fechaQuery = new Date(fecha);
    
    // Validar si la fecha es válida
    if (isNaN(fechaQuery.getTime())) {
      throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
    }

    // Ajustar para que busque desde el inicio del día (00:00:00) 
    // hasta el final del día (23:59:59)
    const fechaInicio = new Date(fechaQuery);
    fechaInicio.setUTCHours(0, 0, 0, 0);

    const fechaFin = new Date(fechaQuery);
    fechaFin.setUTCHours(23, 59, 59, 999);

    return this.citasRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.usuario', 'usuario')
      .leftJoinAndSelect('cita.mascota', 'mascota')
      .leftJoinAndSelect('cita.veterinario', 'veterinario')
      .leftJoinAndSelect('cita.servicio', 'servicio')
      .leftJoinAndSelect('cita.veterinaria', 'veterinaria')
      .where('cita.fechaHora BETWEEN :fechaInicio AND :fechaFin', { 
        fechaInicio, 
        fechaFin 
      })
      .andWhere('cita.isActive = :isActive', { isActive: true })
      .select([
        'cita.id', 'cita.motivo', 'cita.fechaHora', 'cita.estado', 
        'cita.isActive', 'cita.createdAt', 'cita.updatedAt', 
        'usuario.id', 'usuario.username', 'usuario.email', 'usuario.fullName',
        'mascota.id', 'mascota.name', 'mascota.species',
        'veterinario.id', 'veterinario.name',
        'servicio.id', 'servicio.nombre',
        'veterinaria.id', 'veterinaria.nombre'
      ])
      .orderBy('cita.fechaHora', 'ASC')
      .getMany();
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    // Primero obtener la cita actual con relaciones
    const cita = await this.citasRepository.findOne({
      where: { id },
      relations: ['usuario', 'mascota', 'servicio']
    });

    if (!cita) {
      throw new NotFoundException(`Cita with ID ${id} not found`);
    }

    // Verificar usuario si se proporciona
    if (updateCitaDto.usuarioId && updateCitaDto.usuarioId !== cita.usuario.id) {
      const usuario = await this.usersService.findOne(updateCitaDto.usuarioId);
      if (!usuario) {
        throw new NotFoundException(`Usuario with ID ${updateCitaDto.usuarioId} not found`);
      }
      cita.usuario = usuario;
    }

    // Verificar mascota si se proporciona
    if (updateCitaDto.mascotaId && updateCitaDto.mascotaId !== cita.mascota.id) {
      const mascota = await this.petsService.findOne(updateCitaDto.mascotaId);
      if (!mascota) {
        throw new NotFoundException(`Mascota with ID ${updateCitaDto.mascotaId} not found`);
      }

      // Verificar que la mascota pertenezca al usuario
      const usuarioId = updateCitaDto.usuarioId || cita.usuario.id;
      if (mascota.ownerId !== usuarioId) {
        throw new ConflictException('La mascota no pertenece al usuario especificado');
      }
      cita.mascota = mascota;
    }

    // Actualizar solo los campos proporcionados
    if (updateCitaDto.motivo !== undefined) {
      cita.motivo = updateCitaDto.motivo;
    }
    if (updateCitaDto.fechaHora !== undefined) {
      const nuevaFecha = new Date(updateCitaDto.fechaHora);

      // Verificar que la fecha sea futura (excepto si se está cancelando)
      if (updateCitaDto.estado !== 'Cancelada' && nuevaFecha <= new Date()) {
        throw new ConflictException('La fecha de la cita debe ser futura');
      }
      cita.fechaHora = nuevaFecha;
    }
    if (updateCitaDto.estado !== undefined) {
      cita.estado = updateCitaDto.estado;
    }
    if (updateCitaDto.idVeterinario !== undefined) {
      const veterinario = await this.usersService.findOne(updateCitaDto.idVeterinario);
      if (!veterinario) {
        throw new NotFoundException(`Veterinario with ID ${updateCitaDto.idVeterinario} not found`);
      }
      cita.veterinario = veterinario;
    }
    if (updateCitaDto.isActive !== undefined) {
      cita.isActive = updateCitaDto.isActive;
    }
    if (updateCitaDto.servicioId !== undefined) {
      if (updateCitaDto.servicioId === null) {
        cita.servicio = null;
      } else {
        const servicio = await this.serviciosRepository.findOne({ where: { id: updateCitaDto.servicioId } });
        if (!servicio) {
          throw new NotFoundException(`Servicio with ID ${updateCitaDto.servicioId} not found`);
        }
        cita.servicio = servicio;
      }
    }
    if (updateCitaDto.veterinariaId !== undefined) {
      if (updateCitaDto.veterinariaId === null) {
        cita.veterinaria = null;
      } else {
        const veterinaria = await this.veterinariasRepository.findOne({ where: { id: updateCitaDto.veterinariaId } });
        if (!veterinaria) {
          throw new NotFoundException(`Veterinaria with ID ${updateCitaDto.veterinariaId} not found`);
        }
        cita.veterinaria = veterinaria;
      }
    }

    // Guardar cambios
    await this.citasRepository.save(cita);

    // Registrar cambios en el historial
    const cambios = [];

    if (updateCitaDto.motivo !== undefined && updateCitaDto.motivo !== cita.motivo) {
      cambios.push({ campo: 'motivo', anterior: cita.motivo, nuevo: updateCitaDto.motivo });
    }
    if (updateCitaDto.fechaHora !== undefined && updateCitaDto.fechaHora !== cita.fechaHora.toISOString()) {
      cambios.push({ campo: 'fechaHora', anterior: cita.fechaHora.toISOString(), nuevo: updateCitaDto.fechaHora });
    }
    if (updateCitaDto.estado !== undefined && updateCitaDto.estado !== cita.estado) {
      cambios.push({ campo: 'estado', anterior: cita.estado, nuevo: updateCitaDto.estado });
    }

    // Registrar cada cambio en el historial
    for (const cambio of cambios) {
      await this.historialCitasService.registrarActualizacionCita(
        cita.id,
        cita.usuario.id,
        `Se actualizó el campo ${cambio.campo}: de "${cambio.anterior}" a "${cambio.nuevo}"`,
        cambio.anterior,
        cambio.nuevo
      );
    }

    // Devolver la cita actualizada con relaciones desde la base de datos
    const updatedCita = await this.citasRepository.findOne({
      where: { id: cita.id },
      relations: ['usuario', 'mascota', 'veterinario', 'servicio', 'veterinaria'],
      select: ['id', 'motivo', 'fechaHora', 'estado', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
    });

    return updatedCita;
  }

  async remove(id: number): Promise<void> {
    const cita = await this.findOne(id);

    // Registrar eliminación en el historial
    await this.historialCitasService.registrarCancelacionCita(
      cita.id,
      cita.usuario.id,
      `Se eliminó la cita para ${cita.mascota.name} programada para ${cita.fechaHora.toISOString()}`
    );

    // Borrado Lógico: En lugar de remove, marcamos como inactiva
    cita.isActive = false;
    await this.citasRepository.save(cita);
  }

  async getHorariosDisponibles(veterinarioId: number, fecha: string, servicioId?: number): Promise<string[]> {
    // 1. Obtener perfil del veterinario para saber su horario
    const perfilVet = await this.perfilesVetRepository.findOne({
      where: { usuario: { id: veterinarioId }, isActive: true },
      relations: ['usuario']
    });

    // Si no tiene perfil o no tiene horario definido, usar 8:00-17:00 por defecto
    const horaInicioStr = perfilVet?.horaInicio || '08:00';
    const horaFinStr = perfilVet?.horaFin || '17:00';

    // 2. Obtener duración y colchón del servicio
    let duracionMinutos = 30; // Default 30 minutos
    let colchonMinutos = 10;  // Default 10 minutos colchón

    if (servicioId) {
      const servicio = await this.serviciosRepository.findOne({ where: { id: servicioId } });
      if (servicio) {
        duracionMinutos = servicio.duracionMinutos || 30;
        colchonMinutos = servicio.tiempoColchonMinutos !== undefined && servicio.tiempoColchonMinutos !== null
          ? servicio.tiempoColchonMinutos
          : 10;
      }
    }

    const bloqueMinutos = duracionMinutos + colchonMinutos; // Tiempo total bloqueado por cita

    // 3. Obtener citas existentes de este veterinario en la fecha indicada
    const fechaInicio = new Date(`${fecha}T00:00:00`);
    const fechaFin = new Date(`${fecha}T23:59:59`);

    const citasDelDia = await this.citasRepository
      .createQueryBuilder('cita')
      .leftJoinAndSelect('cita.servicio', 'servicio')
      .where('cita.veterinario = :veterinarioId', { veterinarioId })
      .andWhere('cita.fechaHora BETWEEN :inicio AND :fin', { inicio: fechaInicio, fin: fechaFin })
      .andWhere('cita.estado != :cancelada', { cancelada: 'Cancelada' })
      .andWhere('cita.isActive = true')
      .getMany();

    // 4. Generar todos los slots del horario laboral (intervalos de bloqueMinutos)
    const [iniH, iniM] = horaInicioStr.split(':').map(Number);
    const [finH, finM] = horaFinStr.split(':').map(Number);
    const inicioMinutosDia = iniH * 60 + iniM;
    const finMinutosDia = finH * 60 + finM;

    // 5. Marcar bloques ocupados por citas existentes
    const bloquesOcupados: Set<number> = new Set();
    for (const cita of citasDelDia) {
      const citaMin = cita.fechaHora.getHours() * 60 + cita.fechaHora.getMinutes();
      // Calcular el bloque bloqueado específico de cada cita
      const citaDuracion = cita.servicio?.duracionMinutos || 30;
      const citaColchon = cita.servicio?.tiempoColchonMinutos !== undefined && cita.servicio?.tiempoColchonMinutos !== null
        ? cita.servicio.tiempoColchonMinutos
        : 10;
      const citaBloque = citaDuracion + citaColchon;

      // Bloquear todos los slots que se superponen con esta cita
      for (let m = citaMin; m < citaMin + citaBloque; m++) {
        bloquesOcupados.add(m);
      }
    }

    // 6. Generar slots disponibles
    const now = new Date();
    const hoy = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const esHoy = fecha === hoy;
    const minutosActuales = esHoy ? now.getHours() * 60 + now.getMinutes() : -1;

    const horasDisponibles: string[] = [];
    for (let min = inicioMinutosDia; min + bloqueMinutos <= finMinutosDia; min += 30) {
      // No mostrar horarios pasados si es hoy
      if (esHoy && min <= minutosActuales) continue;

      // Verificar si el bloque entero está libre
      let libre = true;
      for (let m = min; m < min + bloqueMinutos; m++) {
        if (bloquesOcupados.has(m)) {
          libre = false;
          break;
        }
      }

      if (libre) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        horasDisponibles.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }
    }

    return horasDisponibles;
  }
}
