"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventarioModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const inventario_controller_1 = require("./inventario.controller");
const inventario_service_1 = require("./inventario.service");
const producto_entity_1 = require("./entities/producto.entity");
const categoria_entity_1 = require("./entities/categoria.entity");
const movimiento_inventario_entity_1 = require("./entities/movimiento-inventario.entity");
const proveedor_entity_1 = require("./entities/proveedor.entity");
const veterinarias_module_1 = require("../veterinarias/veterinarias.module");
const users_module_1 = require("../users/users.module");
let InventarioModule = class InventarioModule {
};
exports.InventarioModule = InventarioModule;
exports.InventarioModule = InventarioModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([producto_entity_1.Producto, categoria_entity_1.Categoria, movimiento_inventario_entity_1.MovimientoInventario, proveedor_entity_1.Proveedor]),
            veterinarias_module_1.VeterinariasModule,
            users_module_1.UsersModule
        ],
        controllers: [inventario_controller_1.InventarioController],
        providers: [inventario_service_1.InventarioService],
        exports: [inventario_service_1.InventarioService],
    })
], InventarioModule);
//# sourceMappingURL=inventario.module.js.map