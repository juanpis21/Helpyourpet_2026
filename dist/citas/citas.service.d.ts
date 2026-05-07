import { Repository } from 'typeorm';
import { Cita } from './entities/cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { UsersService } from '../users/users.service';
import { PetsService } from '../pets/pets.service';
import { HistorialCitasService } from '../historial-citas/historial-citas.service';
export declare class CitasService {
    private citasRepository;
    private usersService;
    private petsService;
    private historialCitasService;
    constructor(citasRepository: Repository<Cita>, usersService: UsersService, petsService: PetsService, historialCitasService: HistorialCitasService);
    create(createCitaDto: CreateCitaDto): Promise<Cita>;
    findAll(): Promise<Cita[]>;
    findOne(id: number): Promise<Cita>;
    findByUsuario(usuarioId: number): Promise<Cita[]>;
    findByMascota(mascotaId: number): Promise<Cita[]>;
    findByEstado(estado: string): Promise<Cita[]>;
    findByFecha(fecha: string): Promise<Cita[]>;
    update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita>;
    remove(id: number): Promise<void>;
}
