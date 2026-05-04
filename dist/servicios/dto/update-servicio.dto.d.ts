import { TipoServicio } from './create-servicio.dto';
export declare class UpdateServicioDto {
    nombre?: string;
    descripcion?: string;
    precioBase?: number;
    duracionMinutos?: number;
    tipoServicio?: TipoServicio;
    requiereCita?: boolean;
    isActive?: boolean;
    veterinariaId?: number;
    imagen?: string;
    etiquetas?: string;
}
