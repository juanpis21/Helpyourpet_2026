import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar autenticación primero
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Obtenemos el nombre del módulo y el rol del usuario
  const requiredModule = route.data['module'] as string;
  const user = authService.getCurrentUser();
  const roleName = user?.role?.name?.toLowerCase() || '';

  // 3. SI EL ROL ES SUPERADMIN, TIENE ACCESO TOTAL SIEMPRE
  if (roleName === 'superadmin') {
    return true;
  }

  // 4. SI LA RUTA NO TIENE 'module' DEFINIDO, dejamos pasar
  if (!requiredModule) {
    return true;
  }

  // 5. Validamos permisos
  const hasAccess = authService.userModules().includes(requiredModule.toLowerCase());

  if (hasAccess) {
    return true;
  }

  // 5. Si no tiene acceso, buscar un módulo al que sí tenga acceso
  const userModules = authService.userModules();
  if (userModules.length > 0) {
    console.warn(`Acceso denegado al módulo: ${requiredModule}, redirigiendo a: ${userModules[0]}`);
    router.navigate([`/${userModules[0]}`]);
  } else {
    console.warn(`Acceso denegado al módulo: ${requiredModule}, sin módulos disponibles`);
    router.navigate(['/login']);
  }
  return false;
};
