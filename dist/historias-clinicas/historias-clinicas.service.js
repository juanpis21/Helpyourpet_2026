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
exports.HistoriasClinicasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const historia_clinica_entity_1 = require("./entities/historia-clinica.entity");
const pets_service_1 = require("../pets/pets.service");
const roles_service_1 = require("../roles/roles.service");
const veterinarias_service_1 = require("../veterinarias/veterinarias.service");
const users_service_1 = require("../users/users.service");
let HistoriasClinicasService = class HistoriasClinicasService {
    constructor(historiaClinicaRepository, petsService, rolesService, veterinariasService, usersService) {
        this.historiaClinicaRepository = historiaClinicaRepository;
        this.petsService = petsService;
        this.rolesService = rolesService;
        this.veterinariasService = veterinariasService;
        this.usersService = usersService;
    }
    async create(createDto) {
        const existing = await this.historiaClinicaRepository.findOne({
            where: { mascotaId: createDto.mascotaId }
        });
        if (existing) {
            throw new common_1.ConflictException(`La mascota con ID ${createDto.mascotaId} ya posee una Historia Clínica. Actualice el fólder existente.`);
        }
        await this.petsService.findOne(createDto.mascotaId);
        await this.rolesService.findOne(createDto.veterinarioId);
        await this.veterinariasService.findOne(createDto.veterinariaId);
        await this.usersService.findOne(createDto.usuarioId);
        const nuevaHistoria = this.historiaClinicaRepository.create(createDto);
        return this.historiaClinicaRepository.save(nuevaHistoria);
    }
    async findAll() {
        return this.historiaClinicaRepository.find({
            relations: ['mascota', 'veterinario', 'veterinaria', 'usuario'],
            order: { fecha: 'DESC' }
        });
    }
    async findOne(id) {
        const historia = await this.historiaClinicaRepository.findOne({
            where: { id },
            relations: ['mascota', 'veterinario', 'veterinaria', 'usuario']
        });
        if (!historia) {
            throw new common_1.NotFoundException(`El expediente maestro con ID ${id} no existe.`);
        }
        return historia;
    }
    async findByMascota(mascotaId) {
        const historia = await this.historiaClinicaRepository.findOne({
            where: { mascotaId },
            relations: ['veterinario', 'veterinaria', 'usuario']
        });
        if (!historia) {
            throw new common_1.NotFoundException(`Aún no se ha aperturado un expediente maestro para el paciente ID ${mascotaId}`);
        }
        return historia;
    }
    async update(id, updateDto) {
        const historia = await this.findOne(id);
        if (updateDto.veterinarioId && updateDto.veterinarioId !== historia.veterinarioId) {
            await this.rolesService.findOne(updateDto.veterinarioId);
            historia.veterinarioId = updateDto.veterinarioId;
        }
        if (updateDto.veterinariaId && updateDto.veterinariaId !== historia.veterinariaId) {
            await this.veterinariasService.findOne(updateDto.veterinariaId);
            historia.veterinariaId = updateDto.veterinariaId;
        }
        if (updateDto.appendMode) {
            const ts = new Date().toLocaleDateString('es-ES');
            if (updateDto.diagnostico) {
                historia.diagnostico = (historia.diagnostico ? historia.diagnostico + '\n\n' : '') + `[${ts}] ` + updateDto.diagnostico;
            }
            if (updateDto.tratamiento) {
                historia.tratamiento = (historia.tratamiento ? historia.tratamiento + '\n\n' : '') + `[${ts}] ` + updateDto.tratamiento;
            }
        }
        else {
            if (updateDto.diagnostico !== undefined)
                historia.diagnostico = updateDto.diagnostico;
            if (updateDto.tratamiento !== undefined)
                historia.tratamiento = updateDto.tratamiento;
        }
        return this.historiaClinicaRepository.save(historia);
    }
    async remove(id) {
        const historia = await this.findOne(id);
        await this.historiaClinicaRepository.delete(historia.id);
    }
};
exports.HistoriasClinicasService = HistoriasClinicasService;
exports.HistoriasClinicasService = HistoriasClinicasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historia_clinica_entity_1.HistoriaClinica)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pets_service_1.PetsService,
        roles_service_1.RolesService,
        veterinarias_service_1.VeterinariasService,
        users_service_1.UsersService])
], HistoriasClinicasService);
//# sourceMappingURL=historias-clinicas.service.js.map