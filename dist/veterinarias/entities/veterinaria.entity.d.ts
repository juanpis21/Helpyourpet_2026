import { PerfilVeterinario } from '../../perfiles-veterinarios/entities/perfil-veterinario.entity';
import { Emergencia } from '../../emergencias/entities/emergencia.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { User } from '../../users/entities/user.entity';
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
    adminId: number;
    admin: User;
    createdAt: Date;
    updatedAt: Date;
}
