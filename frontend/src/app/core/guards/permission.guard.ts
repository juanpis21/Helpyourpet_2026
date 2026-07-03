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

  // Validación ESTRICTA: El módulo DEBE estar explícitamente en la lista de módulos del usuario
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
