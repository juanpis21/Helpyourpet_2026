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

  const requiredModule = route.data['module'] as string;
  const user = authService.getCurrentUser();
  const roleName = user?.role?.name?.toLowerCase() || '';

  if (roleName === 'superadmin') {
    return true;
  }

  if (!requiredModule) {
    return true;
  }

  const userModules = authService.userModules();
  const hasAccess = userModules.includes(requiredModule.toLowerCase());

  if (hasAccess) {
    return true;
  }

  if (userModules.length > 0) {
    router.navigate([`/${userModules[0]}`]);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
