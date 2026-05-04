import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('productos')
@Controller('productos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/productos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, `producto_${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente', type: Producto })
  @ApiResponse({ status: 409, description: 'El producto con este código de barras ya existe' })
  create(@Body() createProductoDto: CreateProductoDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      createProductoDto.imagen = `/uploads/productos/${file.filename}`;
    }
    return this.productosService.create(createProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos', type: [Producto] })
  findAll() {
    return this.productosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto encontrado', type: Producto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.productosService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen', {
    storage: diskStorage({
      destination: './uploads/productos',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, `producto_${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
        cb(new BadRequestException('Solo se permiten imágenes'), false);
      } else {
        cb(null, true);
      }
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado', type: Producto })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id') id: string, 
    @Body() updateProductoDto: UpdateProductoDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      updateProductoDto.imagen = `/uploads/productos/${file.filename}`;
    }
    return this.productosService.update(+id, updateProductoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un producto' })
  @ApiParam({ name: 'id', description: 'ID del producto' })
  @ApiResponse({ status: 204, description: 'Producto eliminado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id') id: string) {
    return this.productosService.remove(+id);
  }
}
