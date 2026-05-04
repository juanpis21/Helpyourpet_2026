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
exports.PetsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pets_service_1 = require("./pets.service");
const create_pet_dto_1 = require("./dto/create-pet.dto");
const update_pet_dto_1 = require("./dto/update-pet.dto");
const pet_entity_1 = require("./entities/pet.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let PetsController = class PetsController {
    constructor(petsService) {
        this.petsService = petsService;
    }
    async create(req, createPetDto, file) {
        const { userId, roles } = req.user;
        const rolesAutorizados = ['admin', 'superadmin', 'veterinario'];
        const userRoles = roles || [];
        const tienePermisoEspecial = userRoles.some(role => rolesAutorizados.includes(role));
        if (!tienePermisoEspecial) {
            console.log(`[SECURITY-PETS] Forzando ownerId ${userId} para el usuario ${req.user.username}`);
            createPetDto.ownerId = userId;
        }
        else if (!createPetDto.ownerId) {
            createPetDto.ownerId = userId;
        }
        if (file) {
            createPetDto.foto = `/uploads/pets/${file.filename}`;
        }
        return await this.petsService.create(createPetDto);
    }
    findAll() {
        return this.petsService.findAll();
    }
    findByOwner(ownerId) {
        return this.petsService.findByOwnerId(+ownerId);
    }
    findOne(id) {
        return this.petsService.findOne(+id);
    }
    update(id, updatePetDto, file) {
        if (file) {
            updatePetDto.foto = `/uploads/pets/${file.filename}`;
        }
        return this.petsService.update(+id, updatePetDto);
    }
    remove(id) {
        return this.petsService.remove(+id);
    }
};
exports.PetsController = PetsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva mascota' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                species: { type: 'string' },
                breed: { type: 'string' },
                age: { type: 'number' },
                gender: { type: 'string' },
                color: { type: 'string' },
                weight: { type: 'number' },
                description: { type: 'string' },
                foto: { type: 'string', format: 'binary' },
                ownerId: { type: 'number' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mascota creada exitosamente', type: pet_entity_1.Pet }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La mascota ya existe' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/pets',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `pet_${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                cb(new common_1.BadRequestException('Solo se permiten imágenes'), false);
            }
            else {
                cb(null, true);
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_pet_dto_1.CreatePetDto, Object]),
    __metadata("design:returntype", Promise)
], PetsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las mascotas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de mascotas', type: [pet_entity_1.Pet] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('owner/:ownerId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener mascotas por dueño' }),
    (0, swagger_1.ApiParam)({ name: 'ownerId', description: 'ID del dueño' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de mascotas del dueño', type: [pet_entity_1.Pet] }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Dueño no encontrado' }),
    __param(0, (0, common_1.Param)('ownerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "findByOwner", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una mascota por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la mascota' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mascota encontrada', type: pet_entity_1.Pet }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mascota no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una mascota' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                species: { type: 'string' },
                breed: { type: 'string' },
                age: { type: 'number' },
                gender: { type: 'string' },
                color: { type: 'string' },
                weight: { type: 'number' },
                description: { type: 'string' },
                foto: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la mascota' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Mascota actualizada', type: pet_entity_1.Pet }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mascota no encontrada' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('foto', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/pets',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `pet_${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                cb(new common_1.BadRequestException('Solo se permiten imágenes'), false);
            }
            else {
                cb(null, true);
            }
        },
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_pet_dto_1.UpdatePetDto, Object]),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una mascota' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la mascota' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Mascota eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Mascota no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PetsController.prototype, "remove", null);
exports.PetsController = PetsController = __decorate([
    (0, swagger_1.ApiTags)('pets'),
    (0, common_1.Controller)('pets'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [pets_service_1.PetsService])
], PetsController);
//# sourceMappingURL=pets.controller.js.map