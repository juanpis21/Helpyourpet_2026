export declare enum TipoServicio {
    CONSULTA = "CONSULTA",
    CIRUGIA = "CIRUGIA",
    VACUNACION = "VACUNACION",
    DESPARASITACION = "DESparasitacion",
    ESTETICA = "ESTETICA",
    LABORATORIO = "LABORATORIO",
    EMERGENCIA = "EMERGENCIA",
    CHECKUP = "CHECKUP"
}
export declare class CreateServicioDto {
    nombre: string;
    descripcion: string;
    precioBase: number;
    duracionMinutos?: number;
    tipoServicio: TipoServicio;
    requiereCita?: boolean;
    isActive?: boolean;
    veterinariaId: number;
    imagen?: string;
    etiquetas?: string;
}
