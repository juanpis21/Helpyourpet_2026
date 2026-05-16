import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  isTermsModalOpen = false;
  isSubmitting = false;
  errorMessage = '';

  formData = {
    nombres: '',
    apellidos: '',
    tipoDocumento: '',
    numDocumento: '',
    celular: '',
    direccion: '',
    edad: null,
    correo: '',
    password: '',
    confirmPassword: '',
    acepto: false
  };

  showPassword = false;
  showConfirmPassword = false;
  placeholderDoc = 'Número de documento';
  patternDoc = '';

  constructor(
    private router: Router,
    private usersService: UsersService
  ) {}

  openTermsModal(event: Event): void {
    event.preventDefault();
    this.isTermsModalOpen = true;
  }

  closeTermsModal(): void {
    this.isTermsModalOpen = false;
  }

  onDocumentTypeChange(): void {
    switch (this.formData.tipoDocumento) {
      case 'Cédula':
        this.placeholderDoc = 'Ej: 12345678';
        this.patternDoc = '[0-9]{6,12}';
        break;
      case 'DNI':
        this.placeholderDoc = 'Ej: 12345678';
        this.patternDoc = '[0-9]{7,9}';
        break;
      case 'Pasaporte':
        this.placeholderDoc = 'Ej: AB123456';
        this.patternDoc = '[A-Z0-9]{6,12}';
        break;
      default:
        this.placeholderDoc = 'Número de documento';
        this.patternDoc = '';
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  socialLogin(provider: string, event: Event): void {
    event.preventDefault();
    alert(`🔄 Funcionalidad de ${provider} en desarrollo`);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    // Validaciones
    if (!this.formData.nombres || !this.formData.apellidos || !this.formData.correo ||
        !this.formData.password || !this.formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Datos no válidos',
        text: 'Por favor, completa todos los campos obligatorios.',
        confirmButtonColor: '#272c8b',
        confirmButtonText: 'Intentar otra vez'
      });
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Datos no válidos',
        text: 'Las contraseñas no coinciden.',
        confirmButtonColor: '#272c8b',
        confirmButtonText: 'Intentar otra vez'
      });
      return;
    }

    if (this.formData.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Datos no válidos',
        text: 'La contraseña debe tener al menos 6 caracteres.',
        confirmButtonColor: '#272c8b',
        confirmButtonText: 'Intentar otra vez'
      });
      return;
    }

    if (!this.formData.acepto) {
      Swal.fire({
        icon: 'error',
        title: 'Datos no válidos',
        text: 'Debes aceptar los términos y condiciones.',
        confirmButtonColor: '#272c8b',
        confirmButtonText: 'Intentar otra vez'
      });
      return;
    }

    if (!this.formData.edad || this.formData.edad < 18) {
      Swal.fire({
        icon: 'warning',
        title: 'Edad no permitida',
        text: 'Debes ser mayor de 18 años para registrarte.',
        confirmButtonColor: '#272c8b',
        confirmButtonText: 'Entendido'
      });
      return;
    }

    this.isSubmitting = true;

    // Mapear datos del formulario al DTO del backend
    const userDto = {
      username: this.formData.correo.split('@')[0] + Math.floor(Math.random() * 1000),
      email: this.formData.correo,
      password: this.formData.password,
      fullName: `${this.formData.nombres} ${this.formData.apellidos}`,
      firstName: this.formData.nombres,
      lastName: this.formData.apellidos,
      phone: this.formData.celular || undefined,
      address: this.formData.direccion || undefined,
      documentType: this.formData.tipoDocumento || undefined,
      documentNumber: this.formData.numDocumento || undefined,
      age: this.formData.edad || undefined,
      isActive: true
      // roleId: el backend asigna el rol 'usuario' por defecto
    };

    this.usersService.createUser(userDto).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: '✅ Usuario registrado exitosamente. Por favor, inicia sesión.',
          confirmButtonColor: '#272c8b',
          confirmButtonText: 'Ir al login'
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        let errorMessage = 'El correo ingresado ya existe o los datos son incorrectos.';
        
        if (error.error?.message) {
          if (Array.isArray(error.error.message)) {
            errorMessage = error.error.message.join(', ');
          } else {
            errorMessage = error.error.message;
          }
        }

        Swal.fire({
          icon: 'error',
          title: 'Datos no válidos',
          text: errorMessage,
          confirmButtonColor: '#272c8b',
          confirmButtonText: 'Intentar otra vez'
        });
        console.error('Register error:', error);
      }
    });
  }
}