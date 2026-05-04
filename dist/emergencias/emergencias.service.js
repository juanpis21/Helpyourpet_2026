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
exports.EmergenciasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const emergencia_entity_1 = require("./entities/emergencia.entity");
const pets_service_1 = require("../pets/pets.service");
const roles_service_1 = require("../roles/roles.service");
const veterinarias_service_1 = require("../veterinarias/veterinarias.service");
let EmergenciasService = class EmergenciasService {
    constructor(emergenciasRepository, petsService, rolesService, veterinariasService) {
        this.emergenciasRepository = emergenciasRepository;
        this.petsService = petsService;
        this.rolesService = rolesService;
        this.veterinariasService = veterinariasService;
    }
    async create(createEmergenciaDto) {
        const mascota = await this.petsService.findOne(createEmergenciaDto.mascotaId);
        if (!mascota) {
            throw new common_1.NotFoundException(`Mascota with ID ${createEmergenciaDto.mascotaId} not found`);
        }
        const veterinario = await this.rolesService.findOne(createEmergenciaDto.veterinarioId);
        if (!veterinario) {
            throw new common_1.NotFoundException(`Veterinario with ID ${createEmergenciaDto.veterinarioId} not found`);
        }
        const veterinaria = await this.veterinariasService.findOne(createEmergenciaDto.veterinariaId);
        if (!veterinaria) {
            throw new common_1.NotFoundException(`Veterinaria with ID ${createEmergenciaDto.veterinariaId} not found`);
        }
        const emergencia = this.emergenciasRepository.create({
            ...createEmergenciaDto,
            mascota,
            veterinario,
            veterinaria,
            fechayhora: createEmergenciaDto.fechayhora || new Date(),
        });
        return this.emergenciasRepository.save(emergencia);
    }
    async findAll() {
        return this.emergenciasRepository.find({
            relations: ['mascota', 'veterinario', 'veterinaria'],
            select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
            order: { fechayhora: 'DESC' }
        });
    }
    async findOne(id) {
        const emergencia = await this.emergenciasRepository.findOne({
            where: { id },
            relations: ['mascota', 'veterinario', 'veterinaria'],
            select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria']
        });
        if (!emergencia) {
            throw new common_1.NotFoundException(`Emergencia with ID ${id} not found`);
        }
        return emergencia;
    }
    async findByMascota(mascotaId) {
        return this.emergenciasRepository.find({
            where: { mascota: { id: mascotaId }, isActive: true },
            relations: ['mascota', 'veterinario', 'veterinaria'],
            select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
            order: { fechayhora: 'DESC' }
        });
    }
    async findByVeterinario(veterinarioId) {
        return this.emergenciasRepository.find({
            where: { veterinario: { id: veterinarioId }, isActive: true },
            relations: ['mascota', 'veterinario', 'veterinaria'],
            select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
            order: { fechayhora: 'DESC' }
        });
    }
    async findByVeterinaria(veterinariaId) {
        return this.emergenciasRepository.find({
            where: { veterinaria: { id: veterinariaId }, isActive: true },
            relations: ['mascota', 'veterinario', 'veterinaria'],
            select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
            order: { fechayhora: 'DESC' }
        });
    }
    async findByTipo(tipo) {
        return this.emergenciasRepository.find({
            where: { tipo, isActive: true },
            relations: ['mascota', 'veterinario', 'veterinaria'],
            select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria'],
            order: { fechayhora: 'DESC' }
        });
    }
    async findByFecha(fecha) {
        const inicioQuery = new Date(fecha);
        if (isNaN(inicioQuery.getTime())) {
            throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }
        const fechaInicio = new Date(inicioQuery);
        fechaInicio.setUTCHours(0, 0, 0, 0);
        const fechaFin = new Date(inicioQuery);
        fechaFin.setUTCHours(23, 59, 59, 999);
        return this.emergenciasRepository
            .createQueryBuilder('emergencia')
            .leftJoinAndSelect('emergencia.mascota', 'mascota')
            .leftJoinAndSelect('emergencia.veterinario', 'veterinario')
            .leftJoinAndSelect('emergencia.veterinaria', 'veterinaria')
            .where('emergencia.fechayhora BETWEEN :fechaInicio AND :fechaFin AND emergencia.isActive = :isActive', {
            fechaInicio,
            fechaFin,
            isActive: true,
        })
            .select(['emergencia.id', 'emergencia.tipo', 'emergencia.fechayhora', 'emergencia.descripcion', 'emergencia.isActive', 'emergencia.createdAt', 'emergencia.updatedAt'])
            .addSelect(['mascota.id', 'mascota.name', 'mascota.species'])
            .addSelect(['veterinario.id', 'veterinario.name'])
            .addSelect(['veterinaria.id', 'veterinaria.nombre'])
            .orderBy('emergencia.fechayhora', 'DESC')
            .getMany();
    }
    async update(id, updateEmergenciaDto) {
        const emergencia = await this.emergenciasRepository.findOne({
            where: { id },
            relations: ['mascota', 'veterinario', 'veterinaria']
        });
        if (!emergencia) {
            throw new common_1.NotFoundException(`Emergencia with ID ${id} not found`);
        }
        if (updateEmergenciaDto.mascotaId && updateEmergenciaDto.mascotaId !== emergencia.mascota.id) {
            const mascota = await this.petsService.findOne(updateEmergenciaDto.mascotaId);
            if (!mascota) {
                throw new common_1.NotFoundException(`Mascota with ID ${updateEmergenciaDto.mascotaId} not found`);
            }
            emergencia.mascota = mascota;
        }
        if (updateEmergenciaDto.veterinarioId && updateEmergenciaDto.veterinarioId !== emergencia.veterinario.id) {
            const veterinario = await this.rolesService.findOne(updateEmergenciaDto.veterinarioId);
            if (!veterinario) {
                throw new common_1.NotFoundException(`Veterinario with ID ${updateEmergenciaDto.veterinarioId} not found`);
            }
            emergencia.veterinario = veterinario;
        }
        if (updateEmergenciaDto.veterinariaId && updateEmergenciaDto.veterinariaId !== emergencia.veterinaria.id) {
            const veterinaria = await this.veterinariasService.findOne(updateEmergenciaDto.veterinariaId);
            if (!veterinaria) {
                throw new common_1.NotFoundException(`Veterinaria with ID ${updateEmergenciaDto.veterinariaId} not found`);
            }
            emergencia.veterinaria = veterinaria;
        }
        if (updateEmergenciaDto.tipo !== undefined) {
            emergencia.tipo = updateEmergenciaDto.tipo;
        }
        if (updateEmergenciaDto.descripcion !== undefined) {
            emergencia.descripcion = updateEmergenciaDto.descripcion;
        }
        if (updateEmergenciaDto.fechayhora !== undefined) {
            emergencia.fechayhora = updateEmergenciaDto.fechayhora;
        }
        if (updateEmergenciaDto.isActive !== undefined) {
            emergencia.isActive = updateEmergenciaDto.isActive;
        }
        await this.emergenciasRepository.save(emergencia);
        const updatedEmergencia = await this.emergenciasRepository.findOne({
            where: { id: emergencia.id },
            relations: ['mascota', 'veterinario', 'veterinaria'],
            select: ['id', 'tipo', 'fechayhora', 'descripcion', 'isActive', 'createdAt', 'updatedAt', 'mascota', 'veterinario', 'veterinaria']
        });
        return updatedEmergencia;
    }
    async remove(id) {
        const emergencia = await this.findOne(id);
        await this.emergenciasRepository.remove(emergencia);
    }
};
exports.EmergenciasService = EmergenciasService;
exports.EmergenciasService = EmergenciasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(emergencia_entity_1.Emergencia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pets_service_1.PetsService,
        roles_service_1.RolesService,
        veterinarias_service_1.VeterinariasService])
], EmergenciasService);
//# sourceMappingURL=emergencias.service.js.map