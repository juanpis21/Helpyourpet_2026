"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cita_entity_1 = require("./entities/cita.entity");
const users_service_1 = require("../users/users.service");
const pets_service_1 = require("../pets/pets.service");
const roles_service_1 = require("../roles/roles.service");
const historial_citas_service_1 = require("../historial-citas/historial-citas.service");
let CitasService = class CitasService {
    constructor(citasRepository, usersService, petsService, rolesService, historialCitasService) {
        this.citasRepository = citasRepository;
        this.usersService = usersService;
        this.petsService = petsService;
        this.rolesService = rolesService;
        this.historialCitasService = historialCitasService;
    }
    async create(createCitaDto) {
        const usuario = await this.usersService.findOne(createCitaDto.usuarioId);
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario with ID ${createCitaDto.usuarioId} not found`);
        }
        const mascota = await this.petsService.findOne(createCitaDto.mascotaId);
        if (!mascota) {
            throw new common_1.NotFoundException(`Mascota with ID ${createCitaDto.mascotaId} not found`);
        }
        if (mascota.ownerId !== createCitaDto.usuarioId) {
            throw new common_1.ConflictException('La mascota no pertenece al usuario especificado');
        }
        const fechaHora = new Date(createCitaDto.fechaHora);
        if (fechaHora <= new Date()) {
            throw new common_1.ConflictException('La fecha de la cita debe ser futura');
        }
        const existingCita = await this.citasRepository.findOne({
            where: {
                mascota: { id: createCitaDto.mascotaId },
                fechaHora: fechaHora
            },
            relations: ['mascota']
        });
        if (existingCita) {
            throw new common_1.ConflictException('Ya existe una cita para esta mascota en el mismo horario');
        }
        const cita = this.citasRepository.create({
            ...createCitaDto,
            fechaHora,
            usuario,
            mascota,
        });
        const savedCita = await this.citasRepository.save(cita);
        await this.historialCitasService.registrarCreacionCita(savedCita.id, createCitaDto.usuarioId, `Se creó la cita para ${mascota.name} el ${fechaHora.toISOString()}`);
        return savedCita;
    }
    async findAll() {
        return this.citasRepository.find({
            where: { isActive: true },
            relations: ['usuario', 'mascota', 'veterinario'],
            select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
        });
    }
    async findOne(id) {
        const cita = await this.citasRepository.findOne({
            where: { id, isActive: true },
            relations: ['usuario', 'mascota', 'veterinario'],
            select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
        });
        if (!cita) {
            throw new common_1.NotFoundException(`Cita with ID ${id} not found`);
        }
        return cita;
    }
    async findByUsuario(usuarioId) {
        return this.citasRepository.find({
            where: { usuario: { id: usuarioId } },
            relations: ['usuario', 'mascota', 'veterinario'],
            select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
            order: { fechaHora: 'ASC' }
        });
    }
    async findByMascota(mascotaId) {
        return this.citasRepository.find({
            where: { mascota: { id: mascotaId } },
            relations: ['usuario', 'mascota', 'veterinario'],
            select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
            order: { fechaHora: 'ASC' }
        });
    }
    async findByEstado(estado) {
        return this.citasRepository.find({
            where: { estado, isActive: true },
            relations: ['usuario', 'mascota', 'veterinario'],
            select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario'],
            order: { fechaHora: 'ASC' }
        });
    }
    async findByFecha(fecha) {
        const fechaQuery = new Date(fecha);
        if (isNaN(fechaQuery.getTime())) {
            throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }
        const fechaInicio = new Date(fechaQuery);
        fechaInicio.setUTCHours(0, 0, 0, 0);
        const fechaFin = new Date(fechaQuery);
        fechaFin.setUTCHours(23, 59, 59, 999);
        return this.citasRepository
            .createQueryBuilder('cita')
            .leftJoinAndSelect('cita.usuario', 'usuario')
            .leftJoinAndSelect('cita.mascota', 'mascota')
            .leftJoinAndSelect('cita.veterinario', 'veterinario')
            .where('cita.fechaHora BETWEEN :fechaInicio AND :fechaFin', {
            fechaInicio,
            fechaFin
        })
            .andWhere('cita.isActive = :isActive', { isActive: true })
            .select([
            'cita.id', 'cita.motivo', 'cita.fechaHora', 'cita.estado', 'cita.notas',
            'cita.isActive', 'cita.createdAt', 'cita.updatedAt',
            'usuario.id', 'usuario.username', 'usuario.email', 'usuario.fullName',
            'mascota.id', 'mascota.name', 'mascota.species',
            'veterinario.id', 'veterinario.name'
        ])
            .orderBy('cita.fechaHora', 'ASC')
            .getMany();
    }
    async update(id, updateCitaDto) {
        const cita = await this.citasRepository.findOne({
            where: { id },
            relations: ['usuario', 'mascota']
        });
        if (!cita) {
            throw new common_1.NotFoundException(`Cita with ID ${id} not found`);
        }
        if (updateCitaDto.usuarioId && updateCitaDto.usuarioId !== cita.usuario.id) {
            const usuario = await this.usersService.findOne(updateCitaDto.usuarioId);
            if (!usuario) {
                throw new common_1.NotFoundException(`Usuario with ID ${updateCitaDto.usuarioId} not found`);
            }
            cita.usuario = usuario;
        }
        if (updateCitaDto.mascotaId && updateCitaDto.mascotaId !== cita.mascota.id) {
            const mascota = await this.petsService.findOne(updateCitaDto.mascotaId);
            if (!mascota) {
                throw new common_1.NotFoundException(`Mascota with ID ${updateCitaDto.mascotaId} not found`);
            }
            const usuarioId = updateCitaDto.usuarioId || cita.usuario.id;
            if (mascota.ownerId !== usuarioId) {
                throw new common_1.ConflictException('La mascota no pertenece al usuario especificado');
            }
            cita.mascota = mascota;
        }
        if (updateCitaDto.motivo !== undefined) {
            cita.motivo = updateCitaDto.motivo;
        }
        if (updateCitaDto.fechaHora !== undefined) {
            const nuevaFecha = new Date(updateCitaDto.fechaHora);
            if (updateCitaDto.estado !== 'Cancelada' && nuevaFecha <= new Date()) {
                throw new common_1.ConflictException('La fecha de la cita debe ser futura');
            }
            cita.fechaHora = nuevaFecha;
        }
        if (updateCitaDto.estado !== undefined) {
            cita.estado = updateCitaDto.estado;
        }
        if (updateCitaDto.notas !== undefined) {
            cita.notas = updateCitaDto.notas;
        }
        if (updateCitaDto.idVeterinario !== undefined) {
            const veterinario = await this.rolesService.findOne(updateCitaDto.idVeterinario);
            if (!veterinario) {
                throw new common_1.NotFoundException(`Veterinario with ID ${updateCitaDto.idVeterinario} not found`);
            }
            cita.veterinario = veterinario;
        }
        if (updateCitaDto.isActive !== undefined) {
            cita.isActive = updateCitaDto.isActive;
        }
        await this.citasRepository.save(cita);
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
        if (updateCitaDto.notas !== undefined && updateCitaDto.notas !== cita.notas) {
            cambios.push({ campo: 'notas', anterior: cita.notas || '', nuevo: updateCitaDto.notas || '' });
        }
        for (const cambio of cambios) {
            await this.historialCitasService.registrarActualizacionCita(cita.id, cita.usuario.id, `Se actualizó el campo ${cambio.campo}: de "${cambio.anterior}" a "${cambio.nuevo}"`, cambio.anterior, cambio.nuevo);
        }
        const updatedCita = await this.citasRepository.findOne({
            where: { id: cita.id },
            relations: ['usuario', 'mascota', 'veterinario'],
            select: ['id', 'motivo', 'fechaHora', 'estado', 'notas', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'mascota', 'veterinario']
        });
        return updatedCita;
    }
    async remove(id) {
        const cita = await this.findOne(id);
        await this.historialCitasService.registrarCancelacionCita(cita.id, cita.usuario.id, `Se eliminó la cita para ${cita.mascota.name} programada para ${cita.fechaHora.toISOString()}`);
        cita.isActive = false;
        await this.citasRepository.save(cita);
    }
};
exports.CitasService = CitasService;
exports.CitasService = CitasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cita_entity_1.Cita)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => historial_citas_service_1.HistorialCitasService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        pets_service_1.PetsService,
        roles_service_1.RolesService,
        historial_citas_service_1.HistorialCitasService])
], CitasService);
//# sourceMappingURL=citas.service.js.map