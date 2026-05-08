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
exports.PerfilesVeterinariosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const perfil_veterinario_entity_1 = require("./entities/perfil-veterinario.entity");
const users_service_1 = require("../users/users.service");
const veterinarias_service_1 = require("../veterinarias/veterinarias.service");
let PerfilesVeterinariosService = class PerfilesVeterinariosService {
    constructor(perfilesVeterinariosRepository, usersService, veterinariasService) {
        this.perfilesVeterinariosRepository = perfilesVeterinariosRepository;
        this.usersService = usersService;
        this.veterinariasService = veterinariasService;
    }
    async create(createPerfilVeterinarioDto) {
        const usuario = await this.usersService.findOne(createPerfilVeterinarioDto.usuarioId);
        if (!usuario) {
            throw new common_1.NotFoundException(`Usuario with ID ${createPerfilVeterinarioDto.usuarioId} not found`);
        }
        const existingPerfil = await this.perfilesVeterinariosRepository.findOne({
            where: { usuario: { id: createPerfilVeterinarioDto.usuarioId }, isActive: true },
            relations: ['usuario']
        });
        if (existingPerfil) {
            throw new common_1.ConflictException('Este usuario ya tiene un perfil veterinario activo');
        }
        const existingMatricula = await this.perfilesVeterinariosRepository.findOne({
            where: { matricula: createPerfilVeterinarioDto.matricula, isActive: true }
        });
        if (existingMatricula) {
            throw new common_1.ConflictException('Esta matrícula profesional ya está registrada');
        }
        let veterinariaPrincipal = null;
        if (createPerfilVeterinarioDto.veterinariaPrincipalId) {
            veterinariaPrincipal = await this.veterinariasService.findOne(createPerfilVeterinarioDto.veterinariaPrincipalId);
            if (!veterinariaPrincipal) {
                throw new common_1.NotFoundException(`Veterinaria with ID ${createPerfilVeterinarioDto.veterinariaPrincipalId} not found`);
            }
        }
        const perfilVeterinario = this.perfilesVeterinariosRepository.create({
            ...createPerfilVeterinarioDto,
            usuario,
            veterinariaPrincipal,
        });
        return this.perfilesVeterinariosRepository.save(perfilVeterinario);
    }
    async findAll() {
        return this.perfilesVeterinariosRepository.find({
            relations: ['usuario', 'veterinariaPrincipal'],
            select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal']
        });
    }
    async findOne(id) {
        const perfilVeterinario = await this.perfilesVeterinariosRepository.findOne({
            where: { id },
            relations: ['usuario', 'veterinariaPrincipal'],
            select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal']
        });
        if (!perfilVeterinario) {
            throw new common_1.NotFoundException(`PerfilVeterinario with ID ${id} not found`);
        }
        return perfilVeterinario;
    }
    async findByUsuario(usuarioId) {
        return this.perfilesVeterinariosRepository.find({
            where: { usuario: { id: usuarioId }, isActive: true },
            relations: ['usuario', 'veterinariaPrincipal'],
            select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal']
        });
    }
    async findByVeterinaria(veterinariaId) {
        return this.perfilesVeterinariosRepository.find({
            where: { veterinariaPrincipal: { id: veterinariaId }, isActive: true },
            relations: ['usuario', 'veterinariaPrincipal'],
            select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal'],
            order: { especialidad: 'ASC' }
        });
    }
    async findByEspecialidad(especialidad) {
        return this.perfilesVeterinariosRepository.find({
            where: { especialidad, isActive: true },
            relations: ['usuario', 'veterinariaPrincipal'],
            select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal'],
            order: { aniosExperiencia: 'DESC' }
        });
    }
    async update(id, updatePerfilVeterinarioDto) {
        const perfilVeterinario = await this.perfilesVeterinariosRepository.findOne({
            where: { id },
            relations: ['usuario', 'veterinariaPrincipal']
        });
        if (!perfilVeterinario) {
            throw new common_1.NotFoundException(`PerfilVeterinario with ID ${id} not found`);
        }
        if (updatePerfilVeterinarioDto.usuarioId && updatePerfilVeterinarioDto.usuarioId !== perfilVeterinario.usuario.id) {
            const usuario = await this.usersService.findOne(updatePerfilVeterinarioDto.usuarioId);
            if (!usuario) {
                throw new common_1.NotFoundException(`Usuario with ID ${updatePerfilVeterinarioDto.usuarioId} not found`);
            }
            const existingPerfil = await this.perfilesVeterinariosRepository.findOne({
                where: { usuario: { id: updatePerfilVeterinarioDto.usuarioId }, isActive: true },
                relations: ['usuario']
            });
            if (existingPerfil && existingPerfil.id !== id) {
                throw new common_1.ConflictException('Este usuario ya tiene un perfil veterinario activo');
            }
            perfilVeterinario.usuario = usuario;
        }
        if (updatePerfilVeterinarioDto.veterinariaPrincipalId !== undefined) {
            if (updatePerfilVeterinarioDto.veterinariaPrincipalId === null) {
                perfilVeterinario.veterinariaPrincipal = null;
            }
            else {
                const veterinaria = await this.veterinariasService.findOne(updatePerfilVeterinarioDto.veterinariaPrincipalId);
                if (!veterinaria) {
                    throw new common_1.NotFoundException(`Veterinaria with ID ${updatePerfilVeterinarioDto.veterinariaPrincipalId} not found`);
                }
                perfilVeterinario.veterinariaPrincipal = veterinaria;
            }
        }
        if (updatePerfilVeterinarioDto.matricula && updatePerfilVeterinarioDto.matricula !== perfilVeterinario.matricula) {
            const existingMatricula = await this.perfilesVeterinariosRepository.findOne({
                where: { matricula: updatePerfilVeterinarioDto.matricula, isActive: true }
            });
            if (existingMatricula && existingMatricula.id !== id) {
                throw new common_1.ConflictException('Esta matrícula profesional ya está registrada');
            }
        }
        if (updatePerfilVeterinarioDto.especialidad !== undefined) {
            perfilVeterinario.especialidad = updatePerfilVeterinarioDto.especialidad;
        }
        if (updatePerfilVeterinarioDto.matricula !== undefined) {
            perfilVeterinario.matricula = updatePerfilVeterinarioDto.matricula;
        }
        if (updatePerfilVeterinarioDto.aniosExperiencia !== undefined) {
            perfilVeterinario.aniosExperiencia = updatePerfilVeterinarioDto.aniosExperiencia;
        }
        if (updatePerfilVeterinarioDto.universidad !== undefined) {
            perfilVeterinario.universidad = updatePerfilVeterinarioDto.universidad;
        }
        if (updatePerfilVeterinarioDto.telefonoProfesional !== undefined) {
            perfilVeterinario.telefonoProfesional = updatePerfilVeterinarioDto.telefonoProfesional;
        }
        if (updatePerfilVeterinarioDto.emailProfesional !== undefined) {
            perfilVeterinario.emailProfesional = updatePerfilVeterinarioDto.emailProfesional;
        }
        if (updatePerfilVeterinarioDto.biografia !== undefined) {
            perfilVeterinario.biografia = updatePerfilVeterinarioDto.biografia;
        }
        if (updatePerfilVeterinarioDto.isActive !== undefined) {
            perfilVeterinario.isActive = updatePerfilVeterinarioDto.isActive;
        }
        await this.perfilesVeterinariosRepository.save(perfilVeterinario);
        const updatedPerfilVeterinario = await this.perfilesVeterinariosRepository.findOne({
            where: { id: perfilVeterinario.id },
            relations: ['usuario', 'veterinariaPrincipal'],
            select: ['id', 'especialidad', 'matricula', 'aniosExperiencia', 'universidad', 'telefonoProfesional', 'emailProfesional', 'biografia', 'isActive', 'createdAt', 'updatedAt', 'usuario', 'veterinariaPrincipal']
        });
        return updatedPerfilVeterinario;
    }
    async remove(id) {
        const perfilVeterinario = await this.findOne(id);
        await this.perfilesVeterinariosRepository.remove(perfilVeterinario);
    }
};
exports.PerfilesVeterinariosService = PerfilesVeterinariosService;
exports.PerfilesVeterinariosService = PerfilesVeterinariosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(perfil_veterinario_entity_1.PerfilVeterinario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        veterinarias_service_1.VeterinariasService])
], PerfilesVeterinariosService);
//# sourceMappingURL=perfiles-veterinarios.service.js.map