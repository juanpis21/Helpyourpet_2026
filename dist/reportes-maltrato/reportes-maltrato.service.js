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
exports.ReportesMaltratoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reporte_maltrato_entity_1 = require("./entities/reporte-maltrato.entity");
const pets_service_1 = require("../pets/pets.service");
let ReportesMaltratoService = class ReportesMaltratoService {
    constructor(reportesRepository, petsService) {
        this.reportesRepository = reportesRepository;
        this.petsService = petsService;
    }
    async create(createDto, usuarioId) {
        if (createDto.mascotaId) {
            await this.petsService.findOne(createDto.mascotaId);
        }
        const reporte = this.reportesRepository.create({
            ...createDto,
            usuarioId,
            estado: reporte_maltrato_entity_1.EstadoReporte.PENDIENTE,
        });
        return this.reportesRepository.save(reporte);
    }
    async findAll() {
        return this.reportesRepository.find({
            relations: ['usuario', 'mascota'],
            order: { fecha: 'DESC' }
        });
    }
    async findByUsuario(usuarioId) {
        return this.reportesRepository.find({
            where: { usuarioId },
            relations: ['mascota'],
            order: { fecha: 'DESC' }
        });
    }
    async findOne(id) {
        const reporte = await this.reportesRepository.findOne({
            where: { id },
            relations: ['usuario', 'mascota']
        });
        if (!reporte) {
            throw new common_1.NotFoundException(`Reporte de maltrato #${id} no encontrado.`);
        }
        return reporte;
    }
    async updateEstado(id, updateDto) {
        const reporte = await this.findOne(id);
        if (updateDto.estado)
            reporte.estado = updateDto.estado;
        if (updateDto.descripcion)
            reporte.descripcion = updateDto.descripcion;
        return this.reportesRepository.save(reporte);
    }
    async remove(id) {
        const reporte = await this.findOne(id);
        await this.reportesRepository.delete(reporte.id);
    }
};
exports.ReportesMaltratoService = ReportesMaltratoService;
exports.ReportesMaltratoService = ReportesMaltratoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reporte_maltrato_entity_1.ReporteMaltrato)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        pets_service_1.PetsService])
], ReportesMaltratoService);
//# sourceMappingURL=reportes-maltrato.service.js.map