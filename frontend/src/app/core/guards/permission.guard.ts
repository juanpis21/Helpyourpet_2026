import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const requiredModule = (route.data['module'] as string) || '';
  const user = authService.getCurrentUser();
  const userModules = authService.userModules();
  const userRole = user?.role?.name?.toLowerCase().trim() || '';

  // 1. Restricciones estrictas por ROL para rutas específicas de paneles
  const path = route.routeConfig?.path;

  if (path === 'super-admin' && userRole !== 'superadmin' && userRole !== 'super-admin') {
    redirectByRole(userRole, router);
    return false;
  }

  if (path === 'admin' && userRole !== 'admin' && userRole !== 'administrador') {
    redirectByRole(userRole, router);
    return false;
  }

  if (path === 'veterinario' && userRole !== 'veterinario') {
    redirectByRole(userRole, router);
    return false;
  }

  if (path === 'perfil-usuario' && userRole !== 'usuario' && userRole !== 'user') {
    redirectByRole(userRole, router);
    return false;
  }

  // 2. Validación ESTRICTA por módulos
  const hasModuleAccess = userModules.includes(requiredModule.toLowerCase());

  if (hasModuleAccess) {
    return true;
  }

  // Si intenta acceder a una ruta sin permiso - CIERRA SESIÓN POR SEGURIDAD
  console.warn(`🚨 [PermissionGuard] Intento no autorizado de acceso a: ${state.url} - Módulo requerido: ${requiredModule}`);
  
  authService.logout();
  
  Swal.fire({
    icon: 'warning',
    title: 'Acceso Denegado',
    text: 'No tienes permiso para acceder a esta sección. Tu sesión ha sido cerrada por seguridad.',
    confirmButtonText: 'Entendido',
    confirmButtonColor: '#258e48',
    background: '#fff',
    customClass: {
      popup: 'swal-rounded'
    }
  });
  
  router.navigate(['/login']);
  return false;
};

function redirectByRole(roleName: string, router: Router): void {
  console.warn(`⚠️ [PermissionGuard] Redirigiendo por rol incorrecto: ${roleName}`);
  if (roleName === 'superadmin' || roleName === 'super-admin') {
    router.navigate(['/super-admin']);
  } else if (roleName === 'admin' || roleName === 'administrador') {
    router.navigate(['/admin']);
  } else if (roleName === 'veterinario') {
    router.navigate(['/inicio']);
  } else {
    router.navigate(['/inicio']);
  }
}
