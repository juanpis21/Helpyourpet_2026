import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CategoriasService } from '../categorias/categorias.service';
import { VeterinariasService } from '../veterinarias/veterinarias.service';
export declare class ProductosService {
    private productosRepository;
    private categoriasService;
    private veterinariasService;
    constructor(productosRepository: Repository<Producto>, categoriasService: CategoriasService, veterinariasService: VeterinariasService);
    create(createProductoDto: CreateProductoDto): Promise<Producto>;
    findAll(): Promise<Producto[]>;
    findOne(id: number): Promise<Producto>;
    update(id: number, updateProductoDto: UpdateProductoDto): Promise<Producto>;
    remove(id: number): Promise<void>;
}
