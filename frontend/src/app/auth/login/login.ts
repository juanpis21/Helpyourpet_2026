import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import Swal from 'sweetalert2';

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
  showPreloader = false;
  preloaderFadingOut = false;

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
      Swal.fire({
        icon: 'warning',
        title: '¡Campos incompletos!',
        text: 'Por favor, completa todos los campos para iniciar sesión.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#258e48',
        background: '#fff',
        customClass: {
          popup: 'swal-rounded'
        }
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.isLoading = false;

        // Redirigir inmediatamente — el preloader se muestra en la vista de destino
        this.redirectByPermissions();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Login error full details:', error);
        if (error.status === 0) {
          Swal.fire({
            icon: 'error',
            title: 'Servidor no disponible',
            text: 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.',
            confirmButtonText: 'Reintentar',
            confirmButtonColor: '#258e48',
            background: '#fff',
            customClass: {
              popup: 'swal-rounded'
            }
          });
        } else if (error.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Credenciales inválidas',
            text: 'El correo o la contraseña no son válidos. Por favor, verifica e intenta nuevamente.',
            confirmButtonText: 'Intentar de nuevo',
            confirmButtonColor: '#258e48',
            background: '#fff',
            customClass: {
              popup: 'swal-rounded'
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error inesperado',
            text: error.error?.message || error.message || 'Ocurrió un error inesperado.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#258e48',
            background: '#fff',
            customClass: {
              popup: 'swal-rounded'
            }
          });
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
