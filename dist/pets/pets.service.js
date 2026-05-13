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
exports.PetsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pet_entity_1 = require("./entities/pet.entity");
const users_service_1 = require("../users/users.service");
let PetsService = class PetsService {
    constructor(petsRepository, usersService) {
        this.petsRepository = petsRepository;
        this.usersService = usersService;
    }
    async create(createPetDto) {
        if (!createPetDto.ownerId) {
            throw new common_1.ConflictException('Se requiere un ID de dueño para registrar la mascota');
        }
        await this.usersService.findOne(createPetDto.ownerId);
        const pet = this.petsRepository.create(createPetDto);
        const savedPet = await this.petsRepository.save(pet);
        return this.petsRepository.findOne({
            where: { id: savedPet.id },
            select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'foto', 'ownerId', 'isActive', 'createdAt', 'updatedAt']
        });
    }
    async findAll() {
        return this.petsRepository.find({
            relations: ['owner'],
            select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'foto', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
        });
    }
    async findOne(id) {
        const pet = await this.petsRepository.findOne({
            where: { id },
            relations: ['owner'],
            select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'foto', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
        });
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID ${id} not found`);
        }
        return pet;
    }
    async findByOwnerId(ownerId) {
        return this.petsRepository.find({
            where: { ownerId },
            relations: ['owner'],
            select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'foto', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
        });
    }
    async findByVeterinaria(veterinarioId) {
        console.log('🔍 [PetsService] Buscando mascotas por veterinaria del vet ID:', veterinarioId);
        const usuarios = await this.usersService.findUsuariosByVeterinaria(veterinarioId);
        const ownerIds = usuarios.map(u => u.id);
        if (ownerIds.length === 0) {
            return [];
        }
        return this.petsRepository.find({
            where: {
                ownerId: (0, typeorm_2.In)(ownerIds)
            },
            relations: ['owner'],
            select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'foto', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner'],
            order: { createdAt: 'DESC' }
        });
    }
    async update(id, updatePetDto) {
        const pet = await this.petsRepository.findOne({
            where: { id },
            relations: ['owner'],
        });
        if (!pet) {
            throw new common_1.NotFoundException(`Pet with ID ${id} not found`);
        }
        if (updatePetDto.name !== undefined) {
            pet.name = updatePetDto.name;
        }
        if (updatePetDto.species !== undefined) {
            pet.species = updatePetDto.species;
        }
        if (updatePetDto.breed !== undefined) {
            pet.breed = updatePetDto.breed;
        }
        if (updatePetDto.age !== undefined) {
            pet.age = updatePetDto.age;
        }
        if (updatePetDto.gender !== undefined) {
            pet.gender = updatePetDto.gender;
        }
        if (updatePetDto.color !== undefined) {
            pet.color = updatePetDto.color;
        }
        if (updatePetDto.weight !== undefined) {
            pet.weight = updatePetDto.weight;
        }
        if (updatePetDto.description !== undefined) {
            pet.description = updatePetDto.description;
        }
        if (updatePetDto.foto !== undefined) {
            pet.foto = updatePetDto.foto;
        }
        if (updatePetDto.ownerId !== undefined) {
            const owner = await this.usersService.findOne(updatePetDto.ownerId);
            pet.owner = owner;
        }
        if (updatePetDto.isActive !== undefined) {
            pet.isActive = updatePetDto.isActive;
        }
        await this.petsRepository.save(pet);
        const updatedPet = await this.petsRepository.findOne({
            where: { id: pet.id },
            relations: ['owner'],
            select: ['id', 'name', 'species', 'breed', 'age', 'gender', 'color', 'weight', 'description', 'foto', 'ownerId', 'isActive', 'createdAt', 'updatedAt', 'owner']
        });
        return updatedPet;
    }
    async remove(id) {
        const pet = await this.findOne(id);
        await this.petsRepository.remove(pet);
    }
};
exports.PetsService = PetsService;
exports.PetsService = PetsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(pet_entity_1.Pet)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], PetsService);
//# sourceMappingURL=pets.service.js.map