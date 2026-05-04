import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    create(createProductoDto: CreateProductoDto, file?: Express.Multer.File): Promise<Producto>;
    findAll(): Promise<Producto[]>;
    findOne(id: string): Promise<Producto>;
    update(id: string, updateProductoDto: UpdateProductoDto, file?: Express.Multer.File): Promise<Producto>;
    remove(id: string): Promise<void>;
}
