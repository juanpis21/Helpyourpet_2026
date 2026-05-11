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
const consulta_medica_entity_1 = require("./entities/consulta-medica.entity");
const pets_service_1 = require("../pets/pets.service");
let HistoriasClinicasService = class HistoriasClinicasService {
    constructor(historiaRepo, consultaRepo, petsService) {
        this.historiaRepo = historiaRepo;
        this.consultaRepo = consultaRepo;
        this.petsService = petsService;
    }
    async findOrCreateByMascota(mascotaId) {
        const existing = await this.historiaRepo.findOne({
            where: { mascotaId },
            relations: ['mascota', 'mascota.owner', 'consultas'],
        });
        if (existing)
            return existing;
        await this.petsService.findOne(mascotaId);
        const nueva = this.historiaRepo.create({ mascotaId });
        return this.historiaRepo.save(nueva);
    }
    async findByMascota(mascotaId) {
        return this.historiaRepo.findOne({
            where: { mascotaId },
            relations: ['mascota', 'mascota.owner', 'consultas'],
            order: { fechaApertura: 'DESC' },
        });
    }
    async create(dto) {
        await this.petsService.findOne(dto.mascotaId);
        const historia = this.historiaRepo.create(dto);
        return this.historiaRepo.save(historia);
    }
    async findAll() {
        return this.historiaRepo.find({
            relations: ['mascota', 'mascota.owner', 'consultas'],
            order: { fechaApertura: 'DESC' },
        });
    }
    async findOne(id) {
        const historia = await this.historiaRepo.findOne({
            where: { id },
            relations: ['mascota', 'mascota.owner', 'consultas'],
        });
        if (!historia) {
            throw new common_1.NotFoundException(`Historia clínica con ID ${id} no encontrada.`);
        }
        return historia;
    }
    async update(id, dto) {
        const historia = await this.findOne(id);
        Object.assign(historia, dto);
        return this.historiaRepo.save(historia);
    }
    async remove(id) {
        const historia = await this.findOne(id);
        await this.historiaRepo.delete(historia.id);
    }
    async createConsulta(dto) {
        await this.findOne(dto.historiaId);
        const consulta = this.consultaRepo.create(dto);
        return this.consultaRepo.save(consulta);
    }
    async findConsultasByHistoria(historiaId) {
        return this.consultaRepo.find({
            where: { historiaId },
            order: { fechaConsulta: 'DESC' },
        });
    }
    async findOneConsulta(id) {
        const consulta = await this.consultaRepo.findOne({ where: { id } });
        if (!consulta)
            throw new common_1.NotFoundException(`Consulta con ID ${id} no encontrada.`);
        return consulta;
    }
    async removeConsulta(id) {
        await this.findOneConsulta(id);
        await this.consultaRepo.delete(id);
    }
};
exports.HistoriasClinicasService = HistoriasClinicasService;
exports.HistoriasClinicasService = HistoriasClinicasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historia_clinica_entity_1.HistoriaClinica)),
    __param(1, (0, typeorm_1.InjectRepository)(consulta_medica_entity_1.ConsultaMedica)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        pets_service_1.PetsService])
], HistoriasClinicasService);
//# sourceMappingURL=historias-clinicas.service.js.map