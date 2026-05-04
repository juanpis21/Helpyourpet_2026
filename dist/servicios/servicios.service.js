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
exports.ServiciosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const servicio_entity_1 = require("./entities/servicio.entity");
const veterinarias_service_1 = require("../veterinarias/veterinarias.service");
let ServiciosService = class ServiciosService {
    constructor(serviciosRepository, veterinariasService) {
        this.serviciosRepository = serviciosRepository;
        this.veterinariasService = veterinariasService;
    }
    async create(createServicioDto) {
        await this.veterinariasService.findOne(createServicioDto.veterinariaId);
        const servicio = this.serviciosRepository.create(createServicioDto);
        return this.serviciosRepository.save(servicio);
    }
    async findAll() {
        return this.serviciosRepository.find({
            relations: ['veterinaria'],
            order: { nombre: 'ASC' }
        });
    }
    async findOne(id) {
        const servicio = await this.serviciosRepository.findOne({
            where: { id },
            relations: ['veterinaria']
        });
        if (!servicio) {
            throw new common_1.NotFoundException(`Servicio with ID ${id} not found`);
        }
        return servicio;
    }
    async update(id, updateServicioDto) {
        const servicio = await this.findOne(id);
        if (updateServicioDto.veterinariaId) {
            await this.veterinariasService.findOne(updateServicioDto.veterinariaId);
        }
        Object.assign(servicio, updateServicioDto);
        return this.serviciosRepository.save(servicio);
    }
    async remove(id) {
        const servicio = await this.findOne(id);
        servicio.isActive = false;
        await this.serviciosRepository.save(servicio);
    }
    async findByVeterinaria(veterinariaId) {
        return this.serviciosRepository.find({
            where: { veterinariaId, isActive: true },
            relations: ['veterinaria'],
            order: { nombre: 'ASC' }
        });
    }
    async findByTipo(tipoServicio) {
        return this.serviciosRepository.find({
            where: { tipoServicio, isActive: true },
            relations: ['veterinaria'],
            order: { nombre: 'ASC' }
        });
    }
    async searchServicios(query) {
        return this.serviciosRepository
            .createQueryBuilder('servicio')
            .leftJoinAndSelect('servicio.veterinaria', 'veterinaria')
            .where('servicio.isActive = :isActive', { isActive: true })
            .andWhere('(servicio.nombre ILIKE :query OR servicio.descripcion ILIKE :query OR servicio.etiquetas ILIKE :query)', { query: `%${query}%` })
            .orderBy('servicio.nombre', 'ASC')
            .getMany();
    }
    async getReporteServiciosPorVeterinaria() {
        return this.serviciosRepository
            .createQueryBuilder('servicio')
            .leftJoin('servicio.veterinaria', 'veterinaria')
            .select('veterinaria.nombre', 'veterinaria')
            .addSelect('COUNT(servicio.id)', 'totalServicios')
            .addSelect('AVG(servicio.precioBase)', 'precioPromedio')
            .where('servicio.isActive = :isActive', { isActive: true })
            .groupBy('veterinaria.id')
            .addGroupBy('veterinaria.nombre')
            .orderBy('veterinaria.nombre', 'ASC')
            .getRawMany();
    }
    async getServiciosPorTipo() {
        return this.serviciosRepository
            .createQueryBuilder('servicio')
            .select('servicio.tipoServicio', 'tipo')
            .addSelect('COUNT(servicio.id)', 'total')
            .addSelect('AVG(servicio.precioBase)', 'precioPromedio')
            .where('servicio.isActive = :isActive', { isActive: true })
            .groupBy('servicio.tipoServicio')
            .orderBy('total', 'DESC')
            .getRawMany();
    }
};
exports.ServiciosService = ServiciosService;
exports.ServiciosService = ServiciosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(servicio_entity_1.Servicio)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        veterinarias_service_1.VeterinariasService])
], ServiciosService);
//# sourceMappingURL=servicios.service.js.map