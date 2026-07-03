import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.getCurrentUser();


    if (!currentUser) {
      this.router.navigate(['/login']);
      return false;
    }

    const requiredRoles = (route.data['roles'] as string[])?.map(r => r.toLowerCase()) || [];
    if (requiredRoles.length > 0) {
      const userRoleName = currentUser.role?.name?.toLowerCase();
      if (!userRoleName || !requiredRoles.includes(userRoleName)) {
        this.redirectByRole(userRoleName);
        return false;
      }
    }

    return true;
  }

  private redirectByRole(roleName: string | undefined): void {
    const authService = this.authService as any;
    const userModules = authService.userModules?.() || [];
    
    switch (roleName) {
      case 'superadmin':
        // Solo redirigir a super-admin si tiene el módulo correspondiente
        if (userModules.includes('super-admin')) {
          this.router.navigate(['/super-admin']);
        } else {
          this.router.navigate(['/inicio']);
        }
        break;
      case 'admin':
        // Solo redirigir a admin si tiene los módulos correspondientes
        if (userModules.includes('admin') || userModules.includes('dashboard')) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/inicio']);
        }
        break;
      case 'veterinario':
        this.router.navigate(['/inicio']);
        break;
      case 'usuario':
      case 'user':
        this.router.navigate(['/inicio']);
        break;
      default:
        this.router.navigate(['/inicio']);
    }
  }
}
