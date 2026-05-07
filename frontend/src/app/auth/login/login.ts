import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  credentials = {
    username: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';

  @HostListener('window:keydown.enter')
  handleKeyDown() {
    this.onSubmit();
  }

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit(): void {
    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;

        // Redirigir según permisos
        this.redirectByPermissions();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error full details:', error);
        if (error.status === 0) {
          this.errorMessage = '❌ No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 3000.';
        } else if (error.status === 401) {
          this.errorMessage = '❌ Credenciales incorrectas. Verifica tu usuario/email y contraseña.';
        } else {
          this.errorMessage = '❌ Error inesperado: ' + (error.error?.message || error.message);
        }
      }
    });
  }

  private redirectByPermissions(): void {
    const user = this.authService.getCurrentUser();
    const userModules = this.authService.userModules();
    const roleName = (user?.role?.name || '').toLowerCase().trim();

    if (user?.roleId === 1) {
      // Superadmin - redirigir a super-admin
      this.router.navigate(['/super-admin']);
      return;
    }

    if (user?.roleId === 2) {
      // Admin - redirigir a admin
      this.router.navigate(['/admin']);
      return;
    }

    if (user?.roleId === 3) {
      // Veterinario - Redirigir a inicio para que vea las publicaciones, pero el navbar se encargará de limitar su menú
      this.router.navigate(['/inicio']);
      return;
    }

    // 2. Fallback por nombre de rol (si roleId no está disponible)
    if (roleName === 'superadmin' || roleName === 'super-admin') {
      this.router.navigate(['/super-admin']);
      return;
    }

    const isAdminRole = roleName === 'admin' ||
      roleName === 'administrador' ||
      roleName === 'administradora' ||
      roleName.includes('admin');

    if (isAdminRole) {
      this.router.navigate(['/admin']);
      return;
    }

    // 3. Veterinarios
    if (roleName === 'veterinario' || roleName === 'veterinaria' || roleName === 'doctor') {
      this.router.navigate(['/veterinario']);
      return;
    }

    // 4. Usuarios estándar
    if (roleName === 'usuario' || roleName === 'cliente') {
      this.router.navigate(['/inicio']);
      return;
    }

    // 4. Fallback por módulos si no se detectó por nombre de rol
    const hasAdminAccess = userModules.includes('dashboard') || userModules.includes('panel-admin');

    if (hasAdminAccess) {
      this.router.navigate(['/admin']);
    } else if (userModules.includes('inicio')) {
      this.router.navigate(['/inicio']);
    } else if (userModules.length > 0) {
      this.router.navigate([`/${userModules[0]}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
