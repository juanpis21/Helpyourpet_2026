export declare class Proveedor {
    id: number;
    nombre: string;
    rut: string;
    contacto?: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    ciudad?: string;
    pais?: string;
    condicionesPago?: string;
    tiempoEntregaDias?: number;
    notas?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
