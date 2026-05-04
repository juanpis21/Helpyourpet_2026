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
exports.CategoriasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const categoria_entity_1 = require("./entities/categoria.entity");
let CategoriasService = class CategoriasService {
    constructor(categoriasRepository) {
        this.categoriasRepository = categoriasRepository;
    }
    async create(createCategoriaDto) {
        const existingCategoria = await this.categoriasRepository.findOne({
            where: { codigo: createCategoriaDto.codigo },
        });
        if (existingCategoria) {
            throw new common_1.ConflictException('Categoria with this codigo already exists');
        }
        const categoria = this.categoriasRepository.create(createCategoriaDto);
        return this.categoriasRepository.save(categoria);
    }
    async findAll() {
        return this.categoriasRepository.find({
            select: ['id', 'nombre', 'descripcion', 'codigo', 'color', 'isActive', 'createdAt', 'updatedAt']
        });
    }
    async findOne(id) {
        const categoria = await this.categoriasRepository.findOne({ where: { id } });
        if (!categoria) {
            throw new common_1.NotFoundException(`Categoria with ID ${id} not found`);
        }
        return categoria;
    }
    async update(id, updateCategoriaDto) {
        const categoria = await this.findOne(id);
        if (updateCategoriaDto.codigo && updateCategoriaDto.codigo !== categoria.codigo) {
            const existingCategoria = await this.categoriasRepository.findOne({
                where: { codigo: updateCategoriaDto.codigo },
            });
            if (existingCategoria) {
                throw new common_1.ConflictException('Categoria with this codigo already exists');
            }
        }
        Object.assign(categoria, updateCategoriaDto);
        return this.categoriasRepository.save(categoria);
    }
    async remove(id) {
        const categoria = await this.findOne(id);
        await this.categoriasRepository.remove(categoria);
    }
};
exports.CategoriasService = CategoriasService;
exports.CategoriasService = CategoriasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_entity_1.Categoria)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriasService);
//# sourceMappingURL=categorias.service.js.map