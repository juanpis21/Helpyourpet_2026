"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarritoModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const carritos_controller_1 = require("./carritos.controller");
const carrito_productos_controller_1 = require("./carrito-productos.controller");
const carrito_service_1 = require("./carrito.service");
const carrito_entity_1 = require("./entities/carrito.entity");
const carrito_producto_entity_1 = require("./entities/carrito-producto.entity");
const users_module_1 = require("../users/users.module");
const productos_module_1 = require("../productos/productos.module");
const auth_module_1 = require("../auth/auth.module");
let CarritoModule = class CarritoModule {
};
exports.CarritoModule = CarritoModule;
exports.CarritoModule = CarritoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([carrito_entity_1.Carrito, carrito_producto_entity_1.CarritoProducto]),
            users_module_1.UsersModule,
            productos_module_1.ProductosModule,
            auth_module_1.AuthModule
        ],
        controllers: [carritos_controller_1.CarritosController, carrito_productos_controller_1.CarritoProductosController],
        providers: [carrito_service_1.CarritoService],
        exports: [carrito_service_1.CarritoService]
    })
], CarritoModule);
//# sourceMappingURL=carrito.module.js.map