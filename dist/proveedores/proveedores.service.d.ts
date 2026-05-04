import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
export declare class ProveedoresService {
    private proveedoresRepository;
    constructor(proveedoresRepository: Repository<Proveedor>);
    create(createProveedorDto: CreateProveedorDto): Promise<Proveedor>;
    findAll(): Promise<Proveedor[]>;
    findOne(id: number): Promise<Proveedor>;
    update(id: number, updateProveedorDto: UpdateProveedorDto): Promise<Proveedor>;
    remove(id: number): Promise<void>;
}
