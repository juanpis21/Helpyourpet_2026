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
exports.PublicacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const publicaciones_service_1 = require("./publicaciones.service");
const create_publicacion_dto_1 = require("./dto/create-publicacion.dto");
const update_publicacion_dto_1 = require("./dto/update-publicacion.dto");
const publicacion_entity_1 = require("./entities/publicacion.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let PublicacionesController = class PublicacionesController {
    constructor(publicacionesService) {
        this.publicacionesService = publicacionesService;
    }
    async create(req, createPublicacionDto, file) {
        const { userId } = req.user;
        if (!createPublicacionDto.autorId) {
            createPublicacionDto.autorId = userId;
        }
        if (file) {
            createPublicacionDto.imagen = `/uploads/publicaciones/${file.filename}`;
        }
        return await this.publicacionesService.create(createPublicacionDto);
    }
    async findAll() {
        return await this.publicacionesService.findAll();
    }
    async findByAutor(autorId) {
        return await this.publicacionesService.findByAutor(+autorId);
    }
    async findOne(id) {
        return await this.publicacionesService.findOne(+id);
    }
    async update(id, updatePublicacionDto) {
        return await this.publicacionesService.update(+id, updatePublicacionDto);
    }
    async remove(id) {
        return await this.publicacionesService.remove(+id);
    }
};
exports.PublicacionesController = PublicacionesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva publicación' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                descripcion: { type: 'string' },
                autorId: { type: 'number' },
                imagen: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Publicación creada exitosamente', type: publicacion_entity_1.Publicacion }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La publicación ya existe' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/publicaciones',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `pub_${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                cb(new common_1.BadRequestException('Solo se permiten imágenes (jpg, jpeg, png, gif, webp)'), false);
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
    __metadata("design:paramtypes", [Object, create_publicacion_dto_1.CreatePublicacionDto, Object]),
    __metadata("design:returntype", Promise)
], PublicacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las publicaciones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de publicaciones', type: [publicacion_entity_1.Publicacion] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PublicacionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('autor/:autorId'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener publicaciones por autor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de publicaciones del autor', type: [publicacion_entity_1.Publicacion] }),
    __param(0, (0, common_1.Param)('autorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicacionesController.prototype, "findByAutor", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una publicación por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Publicación encontrada', type: publicacion_entity_1.Publicacion }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Publicación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicacionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una publicación' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Publicación actualizada', type: publicacion_entity_1.Publicacion }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Publicación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_publicacion_dto_1.UpdatePublicacionDto]),
    __metadata("design:returntype", Promise)
], PublicacionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una publicación (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Publicación eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Publicación no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PublicacionesController.prototype, "remove", null);
exports.PublicacionesController = PublicacionesController = __decorate([
    (0, swagger_1.ApiTags)('publicaciones'),
    (0, common_1.Controller)('publicaciones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [publicaciones_service_1.PublicacionesService])
], PublicacionesController);
//# sourceMappingURL=publicaciones.controller.js.map