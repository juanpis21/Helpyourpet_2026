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
exports.EventosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const evento_entity_1 = require("./entities/evento.entity");
const veterinarias_service_1 = require("../veterinarias/veterinarias.service");
let EventosService = class EventosService {
    constructor(eventosRepository, veterinariasService) {
        this.eventosRepository = eventosRepository;
        this.veterinariasService = veterinariasService;
    }
    async create(createEventoDto) {
        const { fechaInicio, fechaFin, veterinariaId } = createEventoDto;
        if (new Date(fechaFin) < new Date(fechaInicio)) {
            throw new common_1.BadRequestException('La fecha de fin no puede ser anterior a la fecha de inicio.');
        }
        await this.veterinariasService.findOne(veterinariaId);
        const evento = this.eventosRepository.create(createEventoDto);
        return this.eventosRepository.save(evento);
    }
    async findAll() {
        return this.eventosRepository.find({
            relations: ['veterinaria'],
            order: { fechaInicio: 'ASC' }
        });
    }
    async findActive() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return this.eventosRepository.find({
            where: { fechaFin: (0, typeorm_2.MoreThanOrEqual)(hoy) },
            relations: ['veterinaria'],
            order: { fechaInicio: 'ASC' }
        });
    }
    async findOne(id) {
        const evento = await this.eventosRepository.findOne({
            where: { id },
            relations: ['veterinaria']
        });
        if (!evento) {
            throw new common_1.NotFoundException(`El evento con ID ${id} no existe.`);
        }
        return evento;
    }
    async findByVeterinaria(veterinariaId) {
        return this.eventosRepository.find({
            where: { veterinariaId },
            relations: ['veterinaria'],
            order: { fechaInicio: 'DESC' }
        });
    }
    async update(id, updateEventoDto) {
        const evento = await this.findOne(id);
        const fInicio = updateEventoDto.fechaInicio ? new Date(updateEventoDto.fechaInicio) : new Date(evento.fechaInicio);
        const fFin = updateEventoDto.fechaFin ? new Date(updateEventoDto.fechaFin) : new Date(evento.fechaFin);
        if (fFin < fInicio) {
            throw new common_1.BadRequestException('La fecha de cierre no puede ser anterior a la de apertura de la campaña.');
        }
        if (updateEventoDto.veterinariaId && updateEventoDto.veterinariaId !== evento.veterinariaId) {
            await this.veterinariasService.findOne(updateEventoDto.veterinariaId);
        }
        Object.assign(evento, updateEventoDto);
        return this.eventosRepository.save(evento);
    }
    async remove(id) {
        const evento = await this.findOne(id);
        await this.eventosRepository.delete(evento.id);
    }
};
exports.EventosService = EventosService;
exports.EventosService = EventosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(evento_entity_1.Evento)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        veterinarias_service_1.VeterinariasService])
], EventosService);
//# sourceMappingURL=eventos.service.js.map