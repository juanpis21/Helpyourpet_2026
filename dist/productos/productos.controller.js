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
exports.ProductosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const productos_service_1 = require("./productos.service");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const update_producto_dto_1 = require("./dto/update-producto.dto");
const producto_entity_1 = require("./entities/producto.entity");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
let ProductosController = class ProductosController {
    constructor(productosService) {
        this.productosService = productosService;
    }
    create(createProductoDto, file) {
        if (file) {
            createProductoDto.imagen = `/uploads/productos/${file.filename}`;
        }
        return this.productosService.create(createProductoDto);
    }
    findAll() {
        return this.productosService.findAll();
    }
    findOne(id) {
        return this.productosService.findOne(+id);
    }
    update(id, updateProductoDto, file) {
        if (file) {
            updateProductoDto.imagen = `/uploads/productos/${file.filename}`;
        }
        return this.productosService.update(+id, updateProductoDto);
    }
    remove(id) {
        return this.productosService.remove(+id);
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/productos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                cb(null, `producto_${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
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
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo producto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado exitosamente', type: producto_entity_1.Producto }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El producto con este código de barras ya existe' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto, Object]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos', type: [producto_entity_1.Producto] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un producto por ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto encontrado', type: producto_entity_1.Producto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imagen', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/productos',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
                cb(null, `producto_${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
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
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado', type: producto_entity_1.Producto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_producto_dto_1.UpdateProductoDto, Object]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un producto' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID del producto' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Producto eliminado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "remove", null);
exports.ProductosController = ProductosController = __decorate([
    (0, swagger_1.ApiTags)('productos'),
    (0, common_1.Controller)('productos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ProductosController);
//# sourceMappingURL=productos.controller.js.map