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
exports.Publicacion = void 0;
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
let Publicacion = class Publicacion {
};
exports.Publicacion = Publicacion;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID único de la publicación',
        example: 1
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Publicacion.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Descripción de la publicación',
        example: 'Mi mascota necesita un nuevo hogar...'
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Publicacion.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL de la imagen de la publicación',
        example: 'https://example.com/imagen.jpg',
        required: false
    }),
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Publicacion.prototype, "imagen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Autor de la publicación',
        type: () => user_entity_1.User
    }),
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    __metadata("design:type", user_entity_1.User)
], Publicacion.prototype, "autor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID del autor de la publicación',
        example: 25
    }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Publicacion.prototype, "autorId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica si la publicación está activa en el sistema',
        example: true
    }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Publicacion.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de creación del registro',
        example: '2026-03-20T20:00:00.000Z'
    }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Publicacion.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Fecha de última actualización',
        example: '2026-03-20T20:00:00.000Z'
    }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Publicacion.prototype, "updatedAt", void 0);
exports.Publicacion = Publicacion = __decorate([
    (0, typeorm_1.Entity)('publicaciones')
], Publicacion);
//# sourceMappingURL=publicacion.entity.js.map