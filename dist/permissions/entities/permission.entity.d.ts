import { User } from '../../users/entities/user.entity';
export declare enum ModuleName {
    INICIO = "inicio",
    SOBRE_NOSOTROS = "sobre-nosotros",
    ADOPCION = "adopcion",
    TIENDA = "tienda",
    REPORTE = "reporte",
    CALIFICACION = "calificacion",
    VETERINARIO = "veterinario",
    SERVICIOS = "servicios",
    PASARELA_PAGOS = "pasarela-pagos",
    PERFIL_USUARIO = "perfil-usuario",
    PERFIL_VETERINARIO = "perfil-veterinario",
    PANEL_ADMIN = "panel-admin",
    RECOVERY = "recovery"
}
export declare class Permission {
    id: number;
    moduleName: ModuleName;
    canAccess: boolean;
    canCreate: boolean;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    user: User;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}
