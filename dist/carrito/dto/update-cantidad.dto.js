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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCantidadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateCantidadDto {
}
exports.UpdateCantidadDto = UpdateCantidadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Nueva cantidad del producto en el carrito',
        example: 2
    }),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'La cantidad debe ser un número' }),
    (0, class_validator_1.IsPositive)({ message: 'La cantidad debe ser un número positivo' }),
    (0, class_validator_1.Min)(1, { message: 'La cantidad mínima es 1' }),
    __metadata("design:type", Number)
], UpdateCantidadDto.prototype, "cantidad", void 0);
//# sourceMappingURL=update-cantidad.dto.js.map