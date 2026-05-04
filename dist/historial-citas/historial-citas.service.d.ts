import { Repository } from 'typeorm';
import { HistorialCita } from './entities/historial-cita.entity';
import { CreateHistorialCitaDto } from './dto/create-historial-cita.dto';
import { UpdateHistorialCitaDto } from './dto/update-historial-cita.dto';
import { CitasService } from '../citas/citas.service';
import { UsersService } from '../users/users.service';
export declare class HistorialCitasService {
    private historialCitasRepository;
    private citasService;
    private usersService;
    constructor(historialCitasRepository: Repository<HistorialCita>, citasService: CitasService, usersService: UsersService);
    create(createHistorialCitaDto: CreateHistorialCitaDto): Promise<HistorialCita>;
    findAll(): Promise<HistorialCita[]>;
    findOne(id: number): Promise<HistorialCita>;
    findByCita(citaId: number): Promise<HistorialCita[]>;
    findByUsuario(usuarioId: number): Promise<HistorialCita[]>;
    findByTipoCambio(tipoCambio: string): Promise<HistorialCita[]>;
    findByFechaRange(fechaInicio: string, fechaFin: string): Promise<HistorialCita[]>;
    update(id: number, updateHistorialCitaDto: UpdateHistorialCitaDto): Promise<HistorialCita>;
    remove(id: number): Promise<void>;
    registrarCreacionCita(citaId: number, usuarioId: number, descripcion: string): Promise<HistorialCita>;
    registrarActualizacionCita(citaId: number, usuarioId: number, descripcion: string, valorAnterior?: string, valorNuevo?: string): Promise<HistorialCita>;
    registrarCancelacionCita(citaId: number, usuarioId: number, descripcion: string): Promise<HistorialCita>;
    registrarCompletacionCita(citaId: number, usuarioId: number, descripcion: string): Promise<HistorialCita>;
}
