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
exports.VeterinariasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const veterinarias_service_1 = require("./veterinarias.service");
const create_veterinaria_dto_1 = require("./dto/create-veterinaria.dto");
const update_veterinaria_dto_1 = require("./dto/update-veterinaria.dto");
const veterinaria_entity_1 = require("./entities/veterinaria.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const public_decorator_1 = require("../auth/decorators/public.decorator");
let VeterinariasController = class VeterinariasController {
    constructor(veterinariasService) {
        this.veterinariasService = veterinariasService;
    }
    create(createVeterinariaDto) {
        return this.veterinariasService.create(createVeterinariaDto);
    }
    findAll() {
        return this.veterinariasService.findAll();
    }
    findOne(id) {
        return this.veterinariasService.findOne(+id);
    }
    update(id, updateVeterinariaDto) {
        return this.veterinariasService.update(+id, updateVeterinariaDto);
    }
    remove(id) {
        return this.veterinariasService.remove(+id);
    }
};
exports.VeterinariasController = VeterinariasController;
__decorate([
    (0, common_1.Post)(),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva veterinaria' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Veterinaria creada exitosamente', type: veterinaria_entity_1.Veterinaria }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La veterinaria con este correo o RUT ya existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_veterinaria_dto_1.CreateVeterinariaDto]),
    __metadata("design:returntype", void 0)
], VeterinariasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las veterinarias' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de veterinarias', type: [veterinaria_entity_1.Veterinaria] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VeterinariasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener una veterinaria por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la veterinaria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Veterinaria encontrada', type: veterinaria_entity_1.Veterinaria }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Veterinaria no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VeterinariasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una veterinaria' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la veterinaria' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Veterinaria actualizada', type: veterinaria_entity_1.Veterinaria }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Veterinaria no encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'La veterinaria con este correo o RUT ya existe' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_veterinaria_dto_1.UpdateVeterinariaDto]),
    __metadata("design:returntype", void 0)
], VeterinariasController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una veterinaria' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID de la veterinaria' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Veterinaria eliminada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Veterinaria no encontrada' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VeterinariasController.prototype, "remove", null);
exports.VeterinariasController = VeterinariasController = __decorate([
    (0, swagger_1.ApiTags)('veterinarias'),
    (0, common_1.Controller)('veterinarias'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [veterinarias_service_1.VeterinariasService])
], VeterinariasController);
//# sourceMappingURL=veterinarias.controller.js.map