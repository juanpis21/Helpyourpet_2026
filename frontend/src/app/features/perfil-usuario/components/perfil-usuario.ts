import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { MascotasService } from '../services/mascotas.service';
import { PublicacionesService } from '../../inicio/services/publicaciones.service';
import { PreloaderComponent } from '../../../shared/components/preloader/preloader';

interface Mascota {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: string;
  color: string;
  weight: number;
  description: string;
  ownerId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  edad: number;
  tipoDocumento: string;
  numDocumento: string;
  direccion: string;
  imagen: string;
  roleId?: number;
}

interface HistorialClinico {
  id: number;
  petId: number;
  fecha: string;
  tipo: string;
  veterinario: string;
  diagnostico: string;
  tratamiento: string;
  notas: string;
}

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PreloaderComponent],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss'
})
export class PerfilUsuario implements OnInit {
  seccionActiva = 'dashboard';
  sidebarAbierto = false;
  darkMode = false;


  usuario: Usuario = {
    id: 1,
    nombres: 'Juan Carlos',
    apellidos: 'Pérez García',
    correo: 'juan.perez@email.com',
    telefono: '+57 320 456 7890',
    edad: 28,
    direccion: 'Calle 15 #10-20, Duitama, Boyacá',
    tipoDocumento: 'Cédula de Ciudadanía',
    numDocumento: '1052345678',
    imagen: '',
    roleId: undefined
  };

  mascotas: any[] = [];
  publicaciones: any[] = [];

  // Modal state
  showAddPetModal = false;
  showEditPetModal = false;
  newPetImagePreview: string | null = null;
  editingPetImagePreview: string | null = null;
  editingPet: any = {
    id: 0,
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: 'M',
    color: '',
    weight: 0.1,
    description: ''
  };

  // New pet form - campos según tabla pets del backend
  newPet: any = {
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: 'M',
    color: '',
    weight: 0.1,
    description: ''
  };

  // Profile image handling
  selectedProfileImage: File | null = null;
  profileImagePreview: string | null = null;

  // Pet image handling
  selectedPetFile: File | null = null;
  petImagePreview: string | null = null;

  // Historial clínico
  historialClinico: HistorialClinico[] = [];
  mascotaSeleccionadaHistorial: number | null = null;
  showAddHistorialModal = false;
  newHistorial: any = {
    fecha: '',
    tipo: '',
    veterinario: '',
    diagnostico: '',
    tratamiento: '',
    notas: ''
  };
  // Password update data
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  private historialIdCounter = 1;

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private authService: AuthService,
    private usersService: UsersService,
    private mascotasService: MascotasService,
    private publicacionesService: PublicacionesService
  ) {}

  ngOnInit(): void {
    this.darkMode = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.darkMode = dark);

    this.initializeUserData();
  }

  private async initializeUserData(): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      
      if (currentUser) {
        // User already exists in auth service
        await Promise.all([
          this.loadUserProfile(),
          this.cargarMascotasUsuario(),
          this.cargarPublicacionesUsuario()
        ]);
      } else if (this.authService.isLoggedIn()) {
        // Try to reload user from backend
        try {
          await this.authService.reloadUser();
          const userAfterReload = this.authService.getCurrentUser();
          if (userAfterReload) {
            await Promise.all([
              this.loadUserProfile(),
              this.cargarMascotasUsuario(),
              this.cargarPublicacionesUsuario()
            ]);
          } else {
            this.router.navigate(['/login']);
            return;
          }
        } catch (error) {
          console.error('❌ Error al recargar usuario:', error);
          this.router.navigate(['/login']);
          return;
        }
      } else {
        this.router.navigate(['/login']);
        return;
      }
    } catch (error) {
      console.error('❌ Error al inicializar datos del usuario:', error);
    }
  }


  private async loadUserProfile(): Promise<void> {
    return new Promise((resolve) => {
      const currentUser = this.authService.getCurrentUser();
      console.log('[PerfilUsuario] Usuario cargado desde auth:', currentUser);
      if (currentUser) {
        const avatar = currentUser.avatar || '';
        this.usuario = {
          id: currentUser.id,
          nombres: currentUser.firstName || '',
          apellidos: currentUser.lastName || '',
          correo: currentUser.email || '',
          telefono: currentUser.phone || '',
          edad: currentUser.age || 0,
          direccion: currentUser.address || '',
          tipoDocumento: currentUser.documentType || '',
          numDocumento: currentUser.documentNumber || '',
          imagen: avatar && avatar.startsWith('/uploads/') ? `http://localhost:3000${avatar}` : avatar,
          roleId: currentUser.roleId
        };
      }
      resolve();
    });
  }


  private async cargarMascotasUsuario(): Promise<void> {
    return new Promise((resolve) => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.id) {
        this.mascotasService.getMascotasByUsuario(currentUser.id).subscribe({
          next: (mascotas) => {
            this.mascotas = mascotas.map(m => ({
              ...m,
              foto: m.foto && m.foto.startsWith('/uploads/') ? `http://localhost:3000${m.foto}` : m.foto
            }));
            console.log('✅ Mascotas del usuario cargadas:', mascotas.length);
          },
          error: (err) => {
            console.error('❌ Error al cargar mascotas del usuario:', err);
            // Don't show error to user, just log it
          }
        }).add(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  private async cargarPublicacionesUsuario(): Promise<void> {
    return new Promise((resolve) => {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && currentUser.id) {
        this.publicacionesService.getPublicacionesPorAutor(currentUser.id).subscribe({
          next: (publicaciones) => {
            this.publicaciones = publicaciones.map(pub => ({
              ...pub,
              imagen: pub.imagen && pub.imagen.startsWith('/uploads/') ? `http://localhost:3000${pub.imagen}` : pub.imagen
            }));
            console.log('✅ Publicaciones del usuario cargadas:', publicaciones.length);
          },
          error: (err) => {
            console.error('❌ Error al cargar publicaciones del usuario:', err);
            // Don't show error to user, just log it
          }
        }).add(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  eliminarPublicacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      // Eliminar localmente inmediatamente
      this.publicaciones = this.publicaciones.filter(p => p.id !== id);

      this.publicacionesService.eliminarPublicacion(id).subscribe({
        next: () => {
          console.log('✅ Publicación eliminada exitosamente');
          this.cargarPublicacionesUsuario();
          alert('✅ Publicación eliminada exitosamente');
        },
        error: (err) => {
          console.error('❌ Error al eliminar publicación:', err);
          this.cargarPublicacionesUsuario();
          alert('❌ Error al eliminar la publicación: ' + (err.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  // UI Methods
  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    this.sidebarAbierto = false;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  getRoleName(): string {
    const roleMap: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Super Administrador',
      3: 'Veterinario',
      4: 'Usuario'
    };
    return roleMap[this.usuario.roleId || 4] || 'Usuario';
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.themeService.setDarkMode(false);
    this.router.navigate(['/login']);
  }

  // Pet CRUD
  openAddPetModal(): void {
    this.newPet = {
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: 'M',
      color: '',
      weight: 0.1,
      description: ''
    };
    this.showAddPetModal = true;
  }

  closeAddPetModal(): void {
    this.showAddPetModal = false;
    this.newPetImagePreview = null;
  }

  guardarMascota(): void {
    if (!this.newPet.name || !this.newPet.species) {
      alert('Completa nombre y especie');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('No hay usuario autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.newPet.name);
    formData.append('species', this.newPet.species);
    formData.append('breed', this.newPet.breed || 'Mestizo');
    formData.append('age', String(this.newPet.age || 0));
    formData.append('gender', this.newPet.gender || 'M');
    formData.append('color', this.newPet.color || 'Desconocido');
    formData.append('weight', String(this.newPet.weight || 0.1));
    formData.append('description', this.newPet.description || '');
    formData.append('ownerId', String(currentUser.id));
    if (this.selectedPetFile) {
      formData.append('foto', this.selectedPetFile, this.selectedPetFile.name);
    }

    console.log('🔍 Datos enviados al backend:', formData);

    // Enviar al backend
    this.mascotasService.createMascota(formData).subscribe({
      next: (mascotaCreada) => {
        console.log('✅ Mascota creada exitosamente:', mascotaCreada);
        // Recargar las mascotas del usuario
        this.cargarMascotasUsuario();
        // Cerrar modal y limpiar formulario
        this.showAddPetModal = false;
        this.newPet = {
          name: '',
          species: '',
          breed: '',
          age: 0,
          gender: 'M',
          color: '',
          weight: 0.1,
          description: ''
        };
        this.selectedPetFile = null;
        this.newPetImagePreview = null;
        alert('✅ Mascota registrada exitosamente');
      },
      error: (err) => {
        console.error('❌ Error al crear mascota:', err);
        alert('❌ Error al registrar la mascota: ' + (err.error?.message || 'Error desconocido'));
      }
    });
  }

  openEditPetModal(mascota: any): void {
    this.editingPet = { ...mascota };
    this.editingPetImagePreview = mascota.foto || null;
    this.showEditPetModal = true;
  }

  closeEditPetModal(): void {
    this.showEditPetModal = false;
    this.editingPetImagePreview = null;
    this.selectedEditPetFile = null;
    this.editingPet = {
      id: 0,
      name: '',
      species: '',
      breed: '',
      age: 0,
      gender: 'M',
      color: '',
      weight: 0.1,
      description: ''
    };
  }

  guardarEdicionMascota(): void {
    if (!this.editingPet.id) return;

    // Validar peso
    const weight = Number(this.editingPet.weight);
    if (!weight || weight < 0.1 || weight > 200) {
      alert('❌ El peso debe estar entre 0.1 y 200 kg');
      return;
    }

    const formData = new FormData();
    formData.append('name', this.editingPet.name);
    formData.append('species', this.editingPet.species);
    formData.append('breed', this.editingPet.breed || '');
    formData.append('age', String(this.editingPet.age));
    formData.append('gender', this.editingPet.gender);
    formData.append('color', this.editingPet.color);
    formData.append('weight', String(weight));
    formData.append('description', this.editingPet.description);
    if (this.selectedEditPetFile) {
      formData.append('foto', this.selectedEditPetFile, this.selectedEditPetFile.name);
    }

    this.mascotasService.updateMascota(this.editingPet.id, formData).subscribe({
      next: (mascotaActualizada) => {
        console.log('✅ Mascota actualizada exitosamente:', mascotaActualizada);
        this.cargarMascotasUsuario();
        alert('✅ Mascota actualizada exitosamente');
        this.closeEditPetModal();
      },
      error: (err) => {
        console.error('❌ Error al actualizar mascota:', err);
        alert('❌ Error al actualizar la mascota: ' + (err.error?.message || 'Error desconocido'));
        // NO cerrar el modal para que el usuario pueda corregir
      }
    });
  }

  eliminarMascota(id: number): void {
    if (confirm('¿Estás seguro de que quieres desactivar esta mascota?')) {
      // Optimistic update: ocultar de la lista local
      this.mascotas = this.mascotas.filter(m => m.id !== id);

      this.mascotasService.updateMascota(id, { isActive: false }).subscribe({
        next: () => {
          console.log('✅ Mascota desactivada exitosamente');
          this.cargarMascotasUsuario();
          alert('✅ Mascota desactivada exitosamente');
        },
        error: (err) => {
          console.error('❌ Error al desactivar mascota:', err);
          this.cargarMascotasUsuario(); // Revertir si falla
          alert('❌ Error al desactivar la mascota: ' + (err.error?.message || 'Error desconocido'));
        }
      });
    }
  }

  getGeneroTexto(genero: string): string {
    switch (genero) {
      case 'M': return 'Macho';
      case 'F': return 'Hembra';
      default: return 'Desconocido';
    }
  }

  selectedProfileFile: File | null = null;

  onProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  selectedEditPetFile: File | null = null;

  // Métodos para manejar imagen de mascota
  onPetImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPetFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.newPetImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeNewPetImage(): void {
    this.newPetImagePreview = null;
    this.selectedPetFile = null;
  }

  onEditPetImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedEditPetFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editingPetImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeEditPetImage(): void {
    this.editingPetImagePreview = null;
    this.selectedEditPetFile = null;
  }

  guardarPerfil(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('❌ No hay usuario autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', `${this.usuario.nombres} ${this.usuario.apellidos}`);
    formData.append('firstName', this.usuario.nombres);
    formData.append('lastName', this.usuario.apellidos);
    formData.append('email', this.usuario.correo);
    formData.append('phone', this.usuario.telefono || '');
    formData.append('age', String(this.usuario.edad || ''));
    formData.append('address', this.usuario.direccion || '');
    formData.append('documentType', this.usuario.tipoDocumento || '');
    formData.append('documentNumber', this.usuario.numDocumento || '');
    if (this.selectedProfileFile) {
      formData.append('avatar', this.selectedProfileFile, this.selectedProfileFile.name);
    }

    this.usersService.updateUser(currentUser.id, formData).subscribe({
      next: (response) => {
        this.authService.updateCurrentUser(response);
        this.selectedProfileFile = null;
        alert('✅ Perfil actualizado correctamente');
      },
      error: (error) => {
        alert('❌ Error al actualizar el perfil: ' + (error.error?.message || 'Error desconocido'));
        console.error('Update profile error:', error);
      }
    });
  }

  irAAdopciones(): void {
    this.router.navigate(['/adopcion']);
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  eliminarCuenta(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && confirm('¿Estás seguro de que deseas desactivar tu cuenta? Esta acción te cerrará la sesión y no podrás ingresar hasta que sea reactivada.')) {
      this.usersService.deleteUser(currentUser.id).subscribe({
        next: () => {
          alert('Cuenta desactivada exitosamente.');
          this.cerrarSesion();
        },
        error: (error) => {
          alert('❌ Error al eliminar la cuenta: ' + (error.error?.message || 'Error desconocido'));
          console.error('Delete account error:', error);
        }
      });
    }
  }

  // ===== HISTORIAL CLÍNICO =====

  onMascotaHistorialChange(): void {
    if (this.mascotaSeleccionadaHistorial) {
      this.cargarHistorial(this.mascotaSeleccionadaHistorial);
    } else {
      this.historialClinico = [];
    }
  }

  cargarHistorial(petId: number): void {
    // Cargar desde localStorage (datos locales por ahora)
    const key = `historial_${petId}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        this.historialClinico = JSON.parse(saved);
        // Actualizar el counter para evitar IDs duplicados
        const maxId = this.historialClinico.reduce((max, h) => Math.max(max, h.id), 0);
        this.historialIdCounter = maxId + 1;
      } catch {
        this.historialClinico = [];
      }
    } else {
      this.historialClinico = [];
    }
  }

  guardarHistorialEnStorage(): void {
    if (this.mascotaSeleccionadaHistorial) {
      const key = `historial_${this.mascotaSeleccionadaHistorial}`;
      localStorage.setItem(key, JSON.stringify(this.historialClinico));
    }
  }

  getNombreMascotaSeleccionada(): string {
    const mascota = this.mascotas.find(m => m.id === this.mascotaSeleccionadaHistorial);
    return mascota?.name || 'Mascota';
  }

  openAddHistorialModal(): void {
    const today = new Date();
    this.newHistorial = {
      fecha: today.toISOString().split('T')[0],
      tipo: '',
      veterinario: '',
      diagnostico: '',
      tratamiento: '',
      notas: ''
    };
    this.showAddHistorialModal = true;
  }

  closeAddHistorialModal(): void {
    this.showAddHistorialModal = false;
  }

  guardarHistorial(): void {
    if (!this.newHistorial.fecha || !this.newHistorial.tipo) {
      alert('Completa la fecha y el tipo de registro.');
      return;
    }

    const registro: HistorialClinico = {
      id: this.historialIdCounter++,
      petId: this.mascotaSeleccionadaHistorial!,
      fecha: this.newHistorial.fecha,
      tipo: this.newHistorial.tipo,
      veterinario: this.newHistorial.veterinario,
      diagnostico: this.newHistorial.diagnostico,
      tratamiento: this.newHistorial.tratamiento,
      notas: this.newHistorial.notas
    };

    this.historialClinico.unshift(registro);
    this.guardarHistorialEnStorage();
    this.showAddHistorialModal = false;
    alert('✅ Registro clínico guardado exitosamente');
  }

  eliminarHistorial(id: number): void {
    if (confirm('¿Estás seguro de eliminar este registro clínico?')) {
      this.historialClinico = this.historialClinico.filter(h => h.id !== id);
      this.guardarHistorialEnStorage();
    }
  }

  getHistorialIcon(tipo: string): string {
    const icons: { [key: string]: string } = {
      'vacuna': 'fas fa-syringe',
      'consulta': 'fas fa-stethoscope',
      'cirugia': 'fas fa-procedures',
      'desparasitacion': 'fas fa-bug',
      'emergencia': 'fas fa-ambulance',
      'control': 'fas fa-heartbeat'
    };
    return icons[tipo] || 'fas fa-file-medical';
  }

  getHistorialTipoLabel(tipo: string): string {
    const labels: { [key: string]: string } = {
      'vacuna': 'Vacuna',
      'consulta': 'Consulta General',
      'cirugia': 'Cirugía',
      'desparasitacion': 'Desparasitación',
      'emergencia': 'Emergencia',
      'control': 'Control'
    };
    return labels[tipo] || tipo;
  }

  // ===== PASSWORD UPDATE =====
  
  getTotalHistorialRegistros(): number {
    let total = 0;
    this.mascotas.forEach(mascota => {
      const key = `historial_${mascota.id}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const historial = JSON.parse(saved);
          total += historial.length;
        } catch {
          // Ignore parsing errors
        }
      }
    });
    return total;
  }

  actualizarPassword(): void {
    // Validaciones
    if (!this.passwordData.currentPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      alert('❌ Todos los campos de contraseña son obligatorios');
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      alert('❌ Las contraseñas nuevas no coinciden');
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      alert('❌ La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('❌ No hay usuario autenticado');
      return;
    }

    // Verificar contraseña actual primero
    this.authService.verifyCurrentPassword(currentUser.id, this.passwordData.currentPassword).subscribe({
      next: (isValid) => {
        if (!isValid) {
          alert('❌ La contraseña actual es incorrecta');
          return;
        }

        // Actualizar contraseña
        this.usersService.updateUser(currentUser.id, {
          password: this.passwordData.newPassword
        }).subscribe({
          next: () => {
            alert('✅ Contraseña actualizada exitosamente');
            // Limpiar formulario
            this.passwordData = {
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            };
          },
          error: (err) => {
            console.error('❌ Error al actualizar contraseña:', err);
            alert('❌ Error al actualizar la contraseña: ' + (err.error?.message || 'Error desconocido'));
          }
        });
      },
      error: (err) => {
        console.error('❌ Error al verificar contraseña actual:', err);
        alert('❌ Error al verificar la contraseña actual');
      }
    });
  }
}
