"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const eventos_service_1 = require("./eventos.service");
const eventos_controller_1 = require("./eventos.controller");
const evento_entity_1 = require("./entities/evento.entity");
const veterinarias_module_1 = require("../veterinarias/veterinarias.module");
let EventosModule = class EventosModule {
};
exports.EventosModule = EventosModule;
exports.EventosModule = EventosModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([evento_entity_1.Evento]),
            veterinarias_module_1.VeterinariasModule
        ],
        controllers: [eventos_controller_1.EventosController],
        providers: [eventos_service_1.EventosService],
    })
], EventosModule);
//# sourceMappingURL=eventos.module.js.map