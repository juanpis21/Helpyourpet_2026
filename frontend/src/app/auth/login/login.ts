import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
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
    email: '',
    password: ''
  };
  isLoading = false;
  errorMessage = '';
  showPreloader = false;
  preloaderFadingOut = false;
  showPassword = false;
  @ViewChild('usernameInput') usernameInput!: ElementRef;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  onSubmit(): void {
    if (this.isLoading) return;

    if (!this.credentials.email || !this.credentials.password) {
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
      next: () => {
        this.isLoading = false;
        this.redirectByPermissions();
      },
      error: (error) => {
        this.isLoading = false;
        
        let title = 'Error';
        let text = 'Ocurrió un error inesperado.';

        if (error.status === 0) {
          title = 'Servidor no disponible';
          text = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.';
        } else if (error.status === 401) {
          title = 'Credenciales inválidas';
          text = 'El correo o la contraseña no son válidos. Por favor, verifica e intenta nuevamente.';
        } else {
          text = error.error?.message || error.message || text;
        }

        this.credentials.password = '';
        this.cdr.detectChanges(); // Forzar actualización de la vista inmediatamente
        
        setTimeout(() => {
          if (this.usernameInput) this.usernameInput.nativeElement.focus();
        }, 100);

        Swal.fire({
          icon: 'error',
          title: title,
          text: text,
          confirmButtonText: 'Intentar de nuevo',
          confirmButtonColor: '#258e48',
          background: '#fff',
          customClass: {
            popup: 'swal-rounded'
          }
        });
      }
    });
  }

  private redirectByPermissions(): void {
    const userModules = this.authService.userModules();
    const user = this.authService.getCurrentUser();
    
    // Extraer Nombre del rol de forma robusta
    const roleName = user?.role?.name?.toLowerCase().trim() || '';
    


    // 1. SuperAdministrador
    if (roleName === 'superadmin' || roleName === 'super-admin') {
      this.router.navigate(['/super-admin']);
      return;
    }

    // 2. Administrador
    const hasAdminModules = userModules.includes('admin') || 
                            userModules.includes('dashboard');
                            
    if (roleName === 'admin' || roleName === 'administrador' || hasAdminModules) {
      this.router.navigate(['/admin']);
      return;
    }

    // 3. Veterinario
    if (roleName === 'veterinario') {
      this.router.navigate(['/inicio']);
      return;
    }

    // 4. Usuarios estándar / otros con acceso a inicio
    if (userModules.includes('inicio') || roleName === 'usuario') {
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
