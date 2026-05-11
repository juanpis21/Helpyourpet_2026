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
    const userModules = this.authService.userModules();
    const user = this.authService.getCurrentUser();
    
    // Extraer ID y Nombre del rol de forma robusta
    const roleId = Number(user?.roleId || user?.role?.id);
    const roleName = user?.role?.name?.toLowerCase().trim() || '';
    
    console.log('DEBUG REDIRECT:', { 
      roleId, 
      roleName, 
      modules: userModules,
      hasDashboard: userModules.includes('dashboard'),
      hasAdmin: userModules.includes('admin')
    });

    // 1. SuperAdministrador
    if (roleId === 1 || roleName === 'superadmin' || roleName === 'super-admin') {
      this.router.navigate(['/super-admin']);
      return;
    }

    // 2. Administrador
    const hasAdminModules = userModules.includes('admin') || 
                            userModules.includes('dashboard');
                            
    if (roleId === 2 || roleName === 'admin' || roleName === 'administrador' || hasAdminModules) {
      this.router.navigate(['/admin']);
      return;
    }

    // 3. Usuarios estándar / Veterinarios / Otros con acceso a inicio
    if (userModules.includes('inicio') || roleId === 3 || roleId === 4) {
      this.router.navigate(['/inicio']);
      return;
    }

    // Fallback: Primer módulo disponible
    if (userModules.length > 0) {
      const target = userModules[0] === 'super-admin' ? 'inicio' : userModules[0];
      this.router.navigate([`/${target}`]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
