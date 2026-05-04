import { PerfilVeterinario } from '../../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';
import { Producto } from '../../productos/entities/producto.entity';
export declare class Veterinaria {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    email: string;
    descripcion: string;
    veterinarios: PerfilVeterinario[];
    emergencias: Emergencia[];
    productos: Producto[];
    rut: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
