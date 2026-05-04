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
exports.PublicacionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const publicacion_entity_1 = require("./entities/publicacion.entity");
const users_service_1 = require("../users/users.service");
let PublicacionesService = class PublicacionesService {
    constructor(publicacionesRepository, usersService) {
        this.publicacionesRepository = publicacionesRepository;
        this.usersService = usersService;
    }
    async create(createPublicacionDto) {
        if (!createPublicacionDto.autorId) {
            throw new common_1.ConflictException('Se requiere un ID de autor para crear la publicación');
        }
        await this.usersService.findOne(createPublicacionDto.autorId);
        const publicacion = this.publicacionesRepository.create(createPublicacionDto);
        const savedPublicacion = await this.publicacionesRepository.save(publicacion);
        const result = Array.isArray(savedPublicacion) ? savedPublicacion[0] : savedPublicacion;
        return this.publicacionesRepository.findOne({
            where: { id: result.id },
            select: ['id', 'descripcion', 'imagen', 'autorId', 'isActive', 'createdAt', 'updatedAt']
        });
    }
    async findAll() {
        return this.publicacionesRepository.find({
            where: { isActive: true },
            order: { createdAt: 'DESC' }
        });
    }
    async findByAutor(autorId) {
        return this.publicacionesRepository.find({
            where: { autorId, isActive: true },
            order: { createdAt: 'DESC' }
        });
    }
    async findOne(id) {
        const publicacion = await this.publicacionesRepository.findOne({
            where: { id, isActive: true }
        });
        if (!publicacion) {
            throw new common_1.NotFoundException(`Publicación con ID ${id} no encontrada`);
        }
        return publicacion;
    }
    async update(id, updatePublicacionDto) {
        const publicacion = await this.findOne(id);
        await this.publicacionesRepository.update(id, updatePublicacionDto);
        return this.findOne(id);
    }
    async remove(id) {
        const publicacion = await this.findOne(id);
        await this.publicacionesRepository.update(id, { isActive: false });
    }
};
exports.PublicacionesService = PublicacionesService;
exports.PublicacionesService = PublicacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(publicacion_entity_1.Publicacion)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], PublicacionesService);
//# sourceMappingURL=publicaciones.service.js.map