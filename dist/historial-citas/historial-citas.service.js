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
exports.HistorialCitasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const historial_cita_entity_1 = require("./entities/historial-cita.entity");
const create_historial_cita_dto_1 = require("./dto/create-historial-cita.dto");
const citas_service_1 = require("../citas/citas.service");
const users_service_1 = require("../users/users.service");
let HistorialCitasService = class HistorialCitasService {
    constructor(historialCitasRepository, citasService, usersService) {
        this.historialCitasRepository = historialCitasRepository;
        this.citasService = citasService;
        this.usersService = usersService;
    }
    async create(createHistorialCitaDto) {
        const cita = await this.citasService.findOne(createHistorialCitaDto.citaId);
        if (!cita) {
            throw new common_1.NotFoundException(`Cita with ID ${createHistorialCitaDto.citaId} not found`);
        }
        const usuario = await this.usersService.findOne(createHistorialCitaDto.usuarioId);
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario with ID ${createHistorialCitaDto.usuarioId} not found`);
        }
        const historialCita = this.historialCitasRepository.create({
            ...createHistorialCitaDto,
            cita,
            usuario,
        });
        return this.historialCitasRepository.save(historialCita);
    }
    async findAll() {
        return this.historialCitasRepository.find({
            relations: ['cita', 'usuario'],
            order: { fechaRegistro: 'DESC' }
        });
    }
    async findOne(id) {
        const historialCita = await this.historialCitasRepository.findOne({
            where: { id },
            relations: ['cita', 'usuario'],
        });
        if (!historialCita) {
            throw new common_1.NotFoundException(`HistorialCita with ID ${id} not found`);
        }
        return historialCita;
    }
    async findByCita(citaId) {
        console.log(`[DEBUG] Buscando historial para citaId: ${citaId}`);
        try {
            const query = this.historialCitasRepository
                .createQueryBuilder('historial')
                .leftJoinAndSelect('historial.usuario', 'usuario')
                .leftJoinAndSelect('historial.cita', 'cita')
                .where('historial.citaId = :citaId', { citaId })
                .orWhere('cita.id = :citaId', { citaId })
                .orderBy('historial.fechaRegistro', 'DESC');
            const registros = await query.getMany();
            console.log(`[DEBUG] Registros encontrados: ${registros.length}`);
            return registros;
        }
        catch (error) {
            console.error('[DEBUG] Error en findByCita:', error);
            throw error;
        }
    }
    async findByUsuario(usuarioId) {
        const usuario = await this.usersService.findOne(usuarioId);
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario with ID ${usuarioId} not found`);
        }
        return this.historialCitasRepository.find({
            where: { usuario: { id: usuarioId } },
            relations: ['cita'],
            order: { fechaRegistro: 'DESC' }
        });
    }
    async findByTipoCambio(tipoCambio) {
        return this.historialCitasRepository.find({
            where: { tipoCambio },
            relations: ['cita', 'usuario'],
            order: { fechaRegistro: 'DESC' }
        });
    }
    async findByFechaRange(fechaInicio, fechaFin) {
        const inicioQuery = new Date(fechaInicio);
        const finQuery = new Date(fechaFin);
        if (isNaN(inicioQuery.getTime()) || isNaN(finQuery.getTime())) {
            throw new Error('Formato de fecha inválido. Use YYYY-MM-DD');
        }
        const inicio = new Date(inicioQuery);
        inicio.setUTCHours(0, 0, 0, 0);
        const fin = new Date(finQuery);
        fin.setUTCHours(23, 59, 59, 999);
        console.log(`[DEBUG] Buscando historial entre ${inicio.toISOString()} y ${fin.toISOString()}`);
        try {
            console.log(`[DEBUG] Buscando con Between entre ${inicio.toISOString()} y ${fin.toISOString()}`);
            return this.historialCitasRepository.find({
                where: {
                    fechaRegistro: (0, typeorm_2.Between)(inicio, fin)
                },
                relations: ['cita', 'usuario'],
                order: { fechaRegistro: 'DESC' }
            });
        }
        catch (error) {
            console.error('[DEBUG] Error en findByFechaRange:', error);
            throw error;
        }
    }
    async update(id, updateHistorialCitaDto) {
        const historialCita = await this.findOne(id);
        if (updateHistorialCitaDto.tipoCambio !== undefined) {
            historialCita.tipoCambio = updateHistorialCitaDto.tipoCambio;
        }
        if (updateHistorialCitaDto.descripcion !== undefined) {
            historialCita.descripcion = updateHistorialCitaDto.descripcion;
        }
        if (updateHistorialCitaDto.valorAnterior !== undefined) {
            historialCita.valorAnterior = updateHistorialCitaDto.valorAnterior;
        }
        if (updateHistorialCitaDto.valorNuevo !== undefined) {
            historialCita.valorNuevo = updateHistorialCitaDto.valorNuevo;
        }
        return this.historialCitasRepository.save(historialCita);
    }
    async remove(id) {
        const historialCita = await this.findOne(id);
        await this.historialCitasRepository.remove(historialCita);
    }
    async registrarCreacionCita(citaId, usuarioId, descripcion) {
        return this.create({
            citaId,
            tipoCambio: create_historial_cita_dto_1.TipoCambio.CREACION,
            descripcion,
            usuarioId
        });
    }
    async registrarActualizacionCita(citaId, usuarioId, descripcion, valorAnterior, valorNuevo) {
        return this.create({
            citaId,
            tipoCambio: create_historial_cita_dto_1.TipoCambio.ACTUALIZACION,
            descripcion,
            valorAnterior,
            valorNuevo,
            usuarioId
        });
    }
    async registrarCancelacionCita(citaId, usuarioId, descripcion) {
        return this.create({
            citaId,
            tipoCambio: create_historial_cita_dto_1.TipoCambio.CANCELACION,
            descripcion,
            valorAnterior: 'Programada',
            valorNuevo: 'Cancelada',
            usuarioId
        });
    }
    async registrarCompletacionCita(citaId, usuarioId, descripcion) {
        return this.create({
            citaId,
            tipoCambio: create_historial_cita_dto_1.TipoCambio.COMPLETACION,
            descripcion,
            valorAnterior: 'Programada',
            valorNuevo: 'Completada',
            usuarioId
        });
    }
};
exports.HistorialCitasService = HistorialCitasService;
exports.HistorialCitasService = HistorialCitasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(historial_cita_entity_1.HistorialCita)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => citas_service_1.CitasService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        citas_service_1.CitasService,
        users_service_1.UsersService])
], HistorialCitasService);
//# sourceMappingURL=historial-citas.service.js.map