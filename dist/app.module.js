"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const configuration_1 = require("./config/configuration");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const roles_module_1 = require("./roles/roles.module");
const pets_module_1 = require("./pets/pets.module");
const veterinarias_module_1 = require("./veterinarias/veterinarias.module");
const citas_module_1 = require("./citas/citas.module");
const historial_citas_module_1 = require("./historial-citas/historial-citas.module");
const perfiles_veterinarios_module_1 = require("./perfiles-veterinarios/perfiles-veterinarios.module");
const emergencias_module_1 = require("./emergencias/emergencias.module");
const productos_module_1 = require("./productos/productos.module");
const categorias_module_1 = require("./categorias/categorias.module");
const movimientos_module_1 = require("./movimientos/movimientos.module");
const proveedores_module_1 = require("./proveedores/proveedores.module");
const stock_module_1 = require("./stock/stock.module");
const servicios_module_1 = require("./servicios/servicios.module");
const calificaciones_module_1 = require("./calificaciones/calificaciones.module");
const carrito_module_1 = require("./carrito/carrito.module");
const user_entity_1 = require("./users/entities/user.entity");
const role_entity_1 = require("./roles/entities/role.entity");
const pet_entity_1 = require("./pets/entities/pet.entity");
const veterinaria_entity_1 = require("./veterinarias/entities/veterinaria.entity");
const cita_entity_1 = require("./citas/entities/cita.entity");
const perfil_veterinario_entity_1 = require("./perfiles-veterinarios/entities/perfil-veterinario.entity");
const emergencia_entity_1 = require("./emergencias/entities/emergencia.entity");
const historial_cita_entity_1 = require("./historial-citas/entities/historial-cita.entity");
const producto_entity_1 = require("./productos/entities/producto.entity");
const categoria_entity_1 = require("./categorias/entities/categoria.entity");
const movimiento_inventario_entity_1 = require("./movimientos/entities/movimiento-inventario.entity");
const proveedor_entity_1 = require("./proveedores/entities/proveedor.entity");
const servicio_entity_1 = require("./servicios/entities/servicio.entity");
const calificacion_entity_1 = require("./calificaciones/entities/calificacion.entity");
const carrito_entity_1 = require("./carrito/entities/carrito.entity");
const carrito_producto_entity_1 = require("./carrito/entities/carrito-producto.entity");
const ventas_module_1 = require("./ventas/ventas.module");
const venta_entity_1 = require("./ventas/entities/venta.entity");
const detalle_venta_entity_1 = require("./ventas/entities/detalle-venta.entity");
const notificaciones_module_1 = require("./notificaciones/notificaciones.module");
const notificacion_entity_1 = require("./notificaciones/entities/notificacion.entity");
const eventos_module_1 = require("./eventos/eventos.module");
const evento_entity_1 = require("./eventos/entities/evento.entity");
const historias_clinicas_module_1 = require("./historias-clinicas/historias-clinicas.module");
const historia_clinica_entity_1 = require("./historias-clinicas/entities/historia-clinica.entity");
const consulta_medica_entity_1 = require("./historias-clinicas/entities/consulta-medica.entity");
const reportes_maltrato_module_1 = require("./reportes-maltrato/reportes-maltrato.module");
const reporte_maltrato_entity_1 = require("./reportes-maltrato/entities/reporte-maltrato.entity");
const token_recuperacion_module_1 = require("./token-recuperacion/token-recuperacion.module");
const token_recuperacion_entity_1 = require("./token-recuperacion/entities/token-recuperacion.entity");
const publicaciones_module_1 = require("./publicaciones/publicaciones.module");
const publicacion_entity_1 = require("./publicaciones/entities/publicacion.entity");
const permissions_module_1 = require("./permissions/permissions.module");
const permission_entity_1 = require("./permissions/entities/permission.entity");
const modules_module_1 = require("./modules/modules.module");
const module_entity_1 = require("./modules/entities/module.entity");
const mailer_1 = require("@nestjs-modules/mailer");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const monitoring_module_1 = require("./monitoring/monitoring.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                load: [configuration_1.default],
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.database'),
                    entities: [user_entity_1.User, role_entity_1.Role, pet_entity_1.Pet, veterinaria_entity_1.Veterinaria, cita_entity_1.Cita, perfil_veterinario_entity_1.PerfilVeterinario, emergencia_entity_1.Emergencia, historial_cita_entity_1.HistorialCita, producto_entity_1.Producto, categoria_entity_1.Categoria, movimiento_inventario_entity_1.MovimientoInventario, proveedor_entity_1.Proveedor, servicio_entity_1.Servicio, calificacion_entity_1.Calificacion, carrito_entity_1.Carrito, carrito_producto_entity_1.CarritoProducto, venta_entity_1.Venta, detalle_venta_entity_1.DetalleVenta, notificacion_entity_1.Notificacion, evento_entity_1.Evento, historia_clinica_entity_1.HistoriaClinica, consulta_medica_entity_1.ConsultaMedica, reporte_maltrato_entity_1.ReporteMaltrato, token_recuperacion_entity_1.TokenRecuperacion, publicacion_entity_1.Publicacion, permission_entity_1.Permission, module_entity_1.Module],
                    synchronize: configService.get('database.synchronize'),
                    logging: configService.get('database.logging'),
                }),
            }),
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    transport: {
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: configService.get('smtp.user'),
                            pass: configService.get('smtp.pass'),
                        },
                    },
                    defaults: {
                        from: `"Soporte ClinicPet" <${configService.get('smtp.user')}>`,
                    },
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            roles_module_1.RolesModule,
            pets_module_1.PetsModule,
            veterinarias_module_1.VeterinariasModule,
            citas_module_1.CitasModule,
            historial_citas_module_1.HistorialCitasModule,
            perfiles_veterinarios_module_1.PerfilesVeterinariosModule,
            emergencias_module_1.EmergenciasModule,
            productos_module_1.ProductosModule,
            categorias_module_1.CategoriasModule,
            movimientos_module_1.MovimientosModule,
            proveedores_module_1.ProveedoresModule,
            stock_module_1.StockModule,
            servicios_module_1.ServiciosModule,
            calificaciones_module_1.CalificacionesModule,
            carrito_module_1.CarritoModule,
            ventas_module_1.VentasModule,
            notificaciones_module_1.NotificacionesModule,
            eventos_module_1.EventosModule,
            historias_clinicas_module_1.HistoriasClinicasModule,
            reportes_maltrato_module_1.ReportesMaltratoModule,
            token_recuperacion_module_1.TokenRecuperacionModule,
            publicaciones_module_1.PublicacionesModule,
            permissions_module_1.PermissionsModule,
            modules_module_1.ModulesModule,
            monitoring_module_1.MonitoringModule,
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map