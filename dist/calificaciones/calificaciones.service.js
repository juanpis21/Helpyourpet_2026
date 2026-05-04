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
exports.CalificacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const calificacion_entity_1 = require("./entities/calificacion.entity");
const users_service_1 = require("../users/users.service");
const servicios_service_1 = require("../servicios/servicios.service");
let CalificacionesService = class CalificacionesService {
    constructor(calificacionesRepository, usersService, serviciosService) {
        this.calificacionesRepository = calificacionesRepository;
        this.usersService = usersService;
        this.serviciosService = serviciosService;
    }
    async create(usuarioId, createCalificacionDto) {
        const { servicioId, veterinarioId } = createCalificacionDto;
        const servicio = await this.serviciosService.findOne(servicioId);
        await this.usersService.findOne(usuarioId);
        if (veterinarioId) {
            await this.usersService.findOne(veterinarioId);
        }
        const existingCalificacion = await this.calificacionesRepository.findOne({
            where: {
                usuarioId: usuarioId,
                servicioId: servicioId
            }
        });
        if (existingCalificacion) {
            throw new common_1.ConflictException(`El usuario ${usuarioId} ya ha calificado el servicio ${servicioId}`);
        }
        console.log('[DEBUG] Datos recibidos en DTO:', JSON.stringify(createCalificacionDto));
        console.log('[DEBUG] Puntuación recibida:', createCalificacionDto.puntuacion);
        const calificacion = this.calificacionesRepository.create();
        calificacion.puntuacion = createCalificacionDto.puntuacion;
        calificacion.comentario = createCalificacionDto.comentario;
        calificacion.usuarioId = usuarioId;
        calificacion.servicioId = servicioId;
        calificacion.veterinarioId = veterinarioId;
        calificacion.estado = createCalificacionDto.estado || 'APROBADA';
        console.log('[DEBUG] Objeto Calificacion antes de guardar:', JSON.stringify(calificacion));
        return this.calificacionesRepository.save(calificacion);
    }
    async findAll() {
        return this.calificacionesRepository.find({
            relations: ['usuario', 'servicio', 'veterinario'],
            where: { estado: 'APROBADA' },
            order: { fecha: 'DESC' }
        });
    }
    async findOne(id) {
        const calificacion = await this.calificacionesRepository.findOne({
            where: { id },
            relations: ['usuario', 'servicio', 'veterinario']
        });
        if (!calificacion) {
            throw new common_1.NotFoundException(`Calificacion with ID ${id} not found`);
        }
        return calificacion;
    }
    async findByServicio(servicioId) {
        return this.calificacionesRepository.find({
            where: { servicioId, estado: 'APROBADA' },
            relations: ['usuario', 'servicio', 'veterinario'],
            order: { fecha: 'DESC' }
        });
    }
    async findByUsuario(usuarioId) {
        return this.calificacionesRepository.find({
            where: { usuarioId },
            relations: ['servicio', 'veterinario'],
            order: { fecha: 'DESC' }
        });
    }
    async findByVeterinario(veterinarioId) {
        return this.calificacionesRepository.find({
            where: { veterinarioId, estado: 'APROBADA' },
            relations: ['usuario', 'servicio'],
            order: { fecha: 'DESC' }
        });
    }
    async update(id, updateCalificacionDto) {
        const calificacion = await this.findOne(id);
        Object.assign(calificacion, updateCalificacionDto);
        return this.calificacionesRepository.save(calificacion);
    }
    async remove(id) {
        const calificacion = await this.findOne(id);
        await this.calificacionesRepository.remove(calificacion);
    }
    async getEstadisticasPorServicio(servicioId) {
        const result = await this.calificacionesRepository
            .createQueryBuilder('calificacion')
            .select('COUNT(calificacion.id)', 'totalCalificaciones')
            .addSelect('AVG(calificacion.puntuacion)', 'promedioCalificacion')
            .addSelect('COUNT(CASE WHEN calificacion.puntuacion >= 4 THEN 1 END)', 'calificacionesPositivas')
            .addSelect('COUNT(CASE WHEN calificacion.puntuacion <= 2 THEN 1 END)', 'calificacionesNegativas')
            .where('calificacion.servicioId = :servicioId', { servicioId })
            .andWhere('calificacion.estado = :estado', { estado: 'APROBADA' })
            .getRawOne();
        return {
            totalCalificaciones: parseInt(result?.totalCalificaciones || '0'),
            promedioCalificacion: parseFloat(result?.promedioCalificacion || '0').toFixed(2),
            calificacionesPositivas: parseInt(result?.calificacionesPositivas || '0'),
            calificacionesNegativas: parseInt(result?.calificacionesNegativas || '0')
        };
    }
    async getEstadisticasPorVeterinario(veterinarioId) {
        const result = await this.calificacionesRepository
            .createQueryBuilder('calificacion')
            .select('COUNT(calificacion.id)', 'totalCalificaciones')
            .addSelect('AVG(calificacion.puntuacion)', 'promedioCalificacion')
            .where('calificacion.veterinarioId = :veterinarioId', { veterinarioId })
            .andWhere('calificacion.estado = :estado', { estado: 'APROBADA' })
            .getRawOne();
        return {
            totalCalificaciones: parseInt(result?.totalCalificaciones || '0'),
            promedioCalificacion: parseFloat(result?.promedioCalificacion || '0').toFixed(2)
        };
    }
    async getCalificacionesPendientes() {
        return this.calificacionesRepository.find({
            where: { estado: 'PENDIENTE' },
            relations: ['usuario', 'servicio', 'veterinario'],
            order: { fecha: 'ASC' }
        });
    }
};
exports.CalificacionesService = CalificacionesService;
exports.CalificacionesService = CalificacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(calificacion_entity_1.Calificacion)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => servicios_service_1.ServiciosService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        servicios_service_1.ServiciosService])
], CalificacionesService);
//# sourceMappingURL=calificaciones.service.js.map