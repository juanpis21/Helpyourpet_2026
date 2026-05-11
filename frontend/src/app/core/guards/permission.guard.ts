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
  const roleId = Number(user?.roleId || user?.role?.id);
  const roleName = user?.role?.name?.toLowerCase().trim() || '';
  const userModules = authService.userModules();

  const isDashboardAccess = requiredModule.toLowerCase() === 'dashboard';
  const isAdmin = roleId === 2 || roleName === 'admin';
  const hasAccess = userModules.includes(requiredModule.toLowerCase());

  if (hasAccess || (isDashboardAccess && isAdmin) || roleName === 'superadmin') {
    return true;
  }

  if (userModules.length > 0) {
    // Evitar redirección automática al primer módulo si es sensible, priorizar inicio o admin
    const defaultRoute = userModules.includes('inicio') ? 'inicio' : 
                        (userModules.includes('dashboard') || userModules.includes('admin') ? 'admin' : userModules[0]);
    router.navigate([`/${defaultRoute}`]);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
