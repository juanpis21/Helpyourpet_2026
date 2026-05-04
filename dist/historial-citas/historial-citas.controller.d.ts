import { HistorialCitasService } from './historial-citas.service';
import { HistorialCita } from './entities/historial-cita.entity';
export declare class HistorialCitasController {
    private readonly historialCitasService;
    constructor(historialCitasService: HistorialCitasService);
    findAll(): Promise<HistorialCita[]>;
    findByCita(citaId: string): Promise<HistorialCita[]>;
    findByUsuario(usuarioId: string): Promise<HistorialCita[]>;
    findByTipo(tipoCambio: string): Promise<HistorialCita[]>;
    findByFechaRange(fechaInicio: string, fechaFin: string): Promise<HistorialCita[]>;
    findOne(id: string): Promise<HistorialCita>;
}
