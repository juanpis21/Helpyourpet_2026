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
  const roleName = user?.role?.name?.toLowerCase().trim() || '';
  const userModules = authService.userModules();

  // Check if the user has access to the required module
  const hasModuleAccess = userModules.includes(requiredModule.toLowerCase());
  
  // Special handling for specific roles with specific modules
  const isVeterinario = roleName === 'veterinario' && requiredModule.toLowerCase() === 'veterinario';
  const isUsuario = roleName === 'usuario' && requiredModule.toLowerCase() === 'perfil-usuario';
  const isDashboardAccess = requiredModule.toLowerCase() === 'dashboard' && roleName === 'admin';

  // Access is granted only if the module is explicitly in the user's modules list
  if (hasModuleAccess || isVeterinario || isUsuario || isDashboardAccess) {
    return true;
  }

  // Si intenta acceder a una ruta sin permiso - CIERRA SESIÓN POR SEGURIDAD
  console.warn(`🚨 [PermissionGuard] Intento no autorizado de acceso a: ${state.url}`);
  
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
};
