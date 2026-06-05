import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Recovery } from './auth/recovery/recovery';
import { Inicio } from './features/inicio/components/inicio';
import { SobreNosotros } from './features/sobre-nosotros/components/sobre-nosotros';
import { Adopcion } from './features/adopcion/components/adopcion';
import { Tienda } from './features/tienda/components/tienda';
import { Veterinario } from './features/veterinario/components/veterinario';
import { PerfilUsuario } from './features/perfil-usuario/components/perfil-usuario';
import { AdminModulesComponent } from './features/admin-modules/components/admin-modules.component';
import { SuperAdminComponent } from './features/super-admin/components/super-admin.component';
import { Servicios } from './features/servicios/components/servicios';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'recovery', component: Recovery },
  
  { 
    path: 'inicio', 
    component: Inicio,
    canActivate: [permissionGuard],
    data: { module: 'inicio' } 
  },
  { 
    path: 'sobre-nosotros', 
    component: SobreNosotros,
    canActivate: [permissionGuard],
    data: { module: 'sobre-nosotros' }
  },
  { 
    path: 'adopcion', 
    component: Adopcion,
    canActivate: [permissionGuard],
    data: { module: 'adopcion' }
  },
  { 
    path: 'tienda', 
    component: Tienda,
    canActivate: [permissionGuard],
    data: { module: 'tienda' }
  },
  { 
    path: 'veterinario', 
    component: Veterinario,
    canActivate: [permissionGuard],
    data: { module: 'veterinario' }
  },
  { 
    path: 'servicios', 
    component: Servicios,
    canActivate: [permissionGuard],
    data: { module: 'servicios' }
  },
  { 
    path: 'perfil-usuario', 
    component: PerfilUsuario,
    canActivate: [permissionGuard],
    data: { module: 'perfil-usuario' }
  },
  { 
    path: 'admin', 
    component: AdminModulesComponent,
    canActivate: [permissionGuard],
    data: { module: 'dashboard' }
  },
  { 
    path: 'super-admin', 
    component: SuperAdminComponent,
    canActivate: [permissionGuard],
    data: { module: 'super-admin' }
  }
];