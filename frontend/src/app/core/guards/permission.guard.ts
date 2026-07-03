import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

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

  // If no access, redirect to available route
  if (userModules.length > 0) {
    const defaultRoute = userModules.includes('inicio') ? 'inicio' :
      (userModules.includes('dashboard') || userModules.includes('admin') ? 'admin' : userModules[0]);
    router.navigate([`/${defaultRoute}`]);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
