"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePublicacionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_publicacion_dto_1 = require("./create-publicacion.dto");
class UpdatePublicacionDto extends (0, swagger_1.PartialType)(create_publicacion_dto_1.CreatePublicacionDto) {
}
exports.UpdatePublicacionDto = UpdatePublicacionDto;
//# sourceMappingURL=update-publicacion.dto.js.map