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
exports.ServiciosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const servicios_service_1 = require("./servicios.service");
const create_servicio_dto_1 = require("./dto/create-servicio.dto");
const update_servicio_dto_1 = require("./dto/update-servicio.dto");
const servicio_entity_1 = require("./entities/servicio.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let ServiciosController = class ServiciosController {
    constructor(serviciosService) {
        this.serviciosService = serviciosService;
    }
    create(createServicioDto, file) {
        if (file) {
            createServicioDto.imagen = `/uploads/servicios/${file.filename}`;
        }
        return this.serviciosService.create(createServicioDto);
    }
    findAll() {
        return this.serviciosService.findAll();
    }
    findOne(id) {
        return this.serviciosService.findOne(+id);
    }
    update(id, updateServicioDto, file) {
        if (file) {
            updateServicioDto.imagen = `/uploads/servicios/${file.filename}`;
        }
        return this.serviciosService.update(+id, updateServicioDto);
    }
    remove(id) {
        return this.serviciosService.remove(+id);
    }
};
exports.ServiciosController = ServiciosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/servicios',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                cb(null, `servicio_${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
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
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo servicio' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Servicio creado exitosamente', type: servicio_entity_1.Servicio }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_servicio_dto_1.CreateServicioDto, Object]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los servicios activos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de servicios', type: [servicio_entity_1.Servicio] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un servicio por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del servicio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Servicio encontrado', type: servicio_entity_1.Servicio }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Servicio no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/servicios',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                cb(null, `servicio_${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un servicio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del servicio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Servicio actualizado', type: servicio_entity_1.Servicio }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Servicio no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_servicio_dto_1.UpdateServicioDto, Object]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar un servicio' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del servicio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Servicio desactivado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Servicio no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiciosController.prototype, "remove", null);
exports.ServiciosController = ServiciosController = __decorate([
    (0, swagger_1.ApiTags)('servicios'),
    (0, common_1.Controller)('servicios'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [servicios_service_1.ServiciosService])
], ServiciosController);
//# sourceMappingURL=servicios.controller.js.map