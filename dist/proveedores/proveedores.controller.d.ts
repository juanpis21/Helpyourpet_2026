import { ProveedoresService } from './proveedores.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';
export declare class ProveedoresController {
    private readonly proveedoresService;
    constructor(proveedoresService: ProveedoresService);
    create(createProveedorDto: CreateProveedorDto): Promise<Proveedor>;
    findAll(): Promise<Proveedor[]>;
    findOne(id: string): Promise<Proveedor>;
    update(id: string, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor>;
    remove(id: string): Promise<void>;
}
