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
exports.VeterinariasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const veterinaria_entity_1 = require("./entities/veterinaria.entity");
let VeterinariasService = class VeterinariasService {
    constructor(veterinariasRepository) {
        this.veterinariasRepository = veterinariasRepository;
    }
    async create(createVeterinariaDto) {
        const existingRut = await this.veterinariasRepository.findOne({
            where: { rut: createVeterinariaDto.rut },
        });
        if (existingRut) {
            throw new common_1.ConflictException('Veterinaria with this RUT already exists');
        }
        const existingEmail = await this.veterinariasRepository.findOne({
            where: { email: createVeterinariaDto.email },
        });
        if (existingEmail) {
            throw new common_1.ConflictException('Veterinaria with this email already exists');
        }
        const veterinaria = this.veterinariasRepository.create(createVeterinariaDto);
        return this.veterinariasRepository.save(veterinaria);
    }
    async findAll() {
        return this.veterinariasRepository.find({
            relations: ['admin'],
            select: ['id', 'nombre', 'direccion', 'telefono', 'email', 'descripcion', 'rut', 'isActive', 'adminId', 'createdAt', 'updatedAt']
        });
    }
    async findOne(id) {
        const veterinaria = await this.veterinariasRepository.findOne({
            where: { id },
            relations: ['admin'],
            select: ['id', 'nombre', 'direccion', 'telefono', 'email', 'descripcion', 'rut', 'isActive', 'adminId', 'createdAt', 'updatedAt']
        });
        if (!veterinaria) {
            throw new common_1.NotFoundException(`Veterinaria with ID ${id} not found`);
        }
        return veterinaria;
    }
    async update(id, updateVeterinariaDto) {
        const veterinaria = await this.veterinariasRepository.findOne({
            where: { id },
        });
        if (!veterinaria) {
            throw new common_1.NotFoundException(`Veterinaria with ID ${id} not found`);
        }
        if (updateVeterinariaDto.nombre !== undefined) {
            veterinaria.nombre = updateVeterinariaDto.nombre;
        }
        if (updateVeterinariaDto.direccion !== undefined) {
            veterinaria.direccion = updateVeterinariaDto.direccion;
        }
        if (updateVeterinariaDto.telefono !== undefined) {
            veterinaria.telefono = updateVeterinariaDto.telefono;
        }
        if (updateVeterinariaDto.email !== undefined) {
            veterinaria.email = updateVeterinariaDto.email;
        }
        if (updateVeterinariaDto.descripcion !== undefined) {
            veterinaria.descripcion = updateVeterinariaDto.descripcion;
        }
        if (updateVeterinariaDto.rut !== undefined) {
            veterinaria.rut = updateVeterinariaDto.rut;
        }
        if (updateVeterinariaDto.isActive !== undefined) {
            veterinaria.isActive = updateVeterinariaDto.isActive;
        }
        if (updateVeterinariaDto.adminId !== undefined) {
            veterinaria.adminId = updateVeterinariaDto.adminId;
        }
        return this.veterinariasRepository.save(veterinaria);
    }
    async remove(id) {
        const veterinaria = await this.findOne(id);
        await this.veterinariasRepository.remove(veterinaria);
    }
};
exports.VeterinariasService = VeterinariasService;
exports.VeterinariasService = VeterinariasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(veterinaria_entity_1.Veterinaria)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VeterinariasService);
//# sourceMappingURL=veterinarias.service.js.map