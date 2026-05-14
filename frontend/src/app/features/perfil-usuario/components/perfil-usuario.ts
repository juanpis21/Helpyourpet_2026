import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { MascotasService } from '../services/mascotas.service';
import { PublicacionesService } from '../../inicio/services/publicaciones.service';
import { PreloaderComponent } from '../../../shared/components/preloader/preloader';
import { TicketsService } from '../../../core/services/tickets.service';
import type { CreateTicketDto } from '../../../core/services/tickets.service';

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
  sidebarAbierto = true;
  darkMode = false;
  activePubMenuId: number | null = null;

  togglePubMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.activePubMenuId = this.activePubMenuId === id ? null : id;
  }


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
  newPassword: string = '';

  // Ticket modal
  showTicketModal: boolean = false;
  misTickets: any[] = [];
  newTicket: CreateTicketDto = {
    asunto: '',
    descripcion: '',
    prioridad: 'Media'
  };

  openTicketModal(): void {
    this.newTicket = {
      asunto: '',
      descripcion: '',
      prioridad: 'Media'
    };
    this.showTicketModal = true;
  }

  closeTicketModal(): void {
    this.showTicketModal = false;
    this.newTicket = {
      asunto: '',
      descripcion: '',
      prioridad: 'Media'
    };
  }

  createTicket(): void {
    if (!this.newTicket.asunto || !this.newTicket.descripcion) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    if (this.newTicket.asunto.length < 5) {
      alert('El asunto debe tener al menos 5 caracteres');
      return;
    }

    if (this.newTicket.descripcion.length < 10) {
      alert('La descripción debe tener al menos 10 caracteres');
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Debes estar logueado para crear un ticket');
      return;
    }

    this.ticketsService.create(this.newTicket).subscribe({
      next: () => {
        this.closeTicketModal();
        this.loadMyTickets();
        alert('Ticket creado correctamente. Te responderemos pronto.');
      },
      error: (err) => {
        console.error('Error creating ticket:', err);
        alert('Error al crear ticket. Por favor intenta nuevamente.');
      }
    });
  }

  private historialIdCounter = 1;

  constructor(
    private router: Router, 
    private themeService: ThemeService,
    private authService: AuthService,
    private usersService: UsersService,
    private mascotasService: MascotasService,
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef,
    private ticketsService: TicketsService
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
          this.cargarPublicacionesUsuario(),
          this.loadMyTickets()
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
    Swal.fire({
      title: '¿Eliminar publicación?',
      text: '¿Estás seguro de que quieres eliminar esta publicación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicaciones = this.publicaciones.filter(p => p.id !== id);

        this.publicacionesService.eliminarPublicacion(id).subscribe({
          next: () => {
            console.log('✅ Publicación eliminada exitosamente');
            this.cargarPublicacionesUsuario();
            Swal.fire('Eliminada', 'Publicación eliminada exitosamente', 'success');
          },
          error: (err) => {
            console.error('❌ Error al eliminar publicación:', err);
            this.cargarPublicacionesUsuario();
            Swal.fire('Error', 'Error al eliminar la publicación: ' + (err.error?.message || 'Error desconocido'), 'error');
          }
        });
      }
    });
  }

  // UI Methods
  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
    if (seccion === 'tickets') {
      this.loadMyTickets();
    }
  }

  loadMyTickets(): void {
    this.ticketsService.getMyTickets().subscribe({
      next: (tickets) => this.misTickets = tickets,
      error: (err) => console.error('Error loading my tickets:', err)
    });
  }

  toggleSidebar(): void {
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    this.sidebarAbierto = false;
  }

  closeAllMenus(): void {
    this.activePubMenuId = null;
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
      Swal.fire('¡Atención!', 'Completa nombre y especie', 'warning');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      Swal.fire('¡Error!', 'No hay usuario autenticado', 'error');
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
        Swal.fire('¡Éxito!', 'Mascota registrada exitosamente', 'success');
      },
      error: (err) => {
        console.error('❌ Error al crear mascota:', err);
        Swal.fire('Error', 'Error al registrar la mascota: ' + (err.error?.message || 'Error desconocido'), 'error');
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
      Swal.fire('Atención', 'El peso debe estar entre 0.1 y 200 kg', 'warning');
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
        Swal.fire('¡Actualizada!', 'Mascota actualizada exitosamente', 'success');
        this.closeEditPetModal();
      },
      error: (err) => {
        console.error('❌ Error al actualizar mascota:', err);
        Swal.fire('Error', 'Error al actualizar la mascota: ' + (err.error?.message || 'Error desconocido'), 'error');
        // NO cerrar el modal para que el usuario pueda corregir
      }
    });
  }

  eliminarMascota(id: number): void {
    Swal.fire({
      title: '¿Desactivar mascota?',
      text: '¿Estás seguro de que quieres desactivar esta mascota?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Optimistic update: ocultar de la lista local
        this.mascotas = this.mascotas.filter(m => m.id !== id);

        this.mascotasService.updateMascota(id, { isActive: false }).subscribe({
          next: () => {
            console.log('✅ Mascota desactivada exitosamente');
            this.cargarMascotasUsuario();
            Swal.fire('Desactivada', 'Mascota desactivada exitosamente', 'success');
          },
          error: (err) => {
            console.error('❌ Error al desactivar mascota:', err);
            this.cargarMascotasUsuario(); // Revertir si falla
            Swal.fire('Error', 'Error al desactivar la mascota: ' + (err.error?.message || 'Error desconocido'), 'error');
          }
        });
      }
    });
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
      Swal.fire('Error', 'No hay usuario autenticado', 'error');
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
        Swal.fire('¡Actualizado!', 'Perfil actualizado correctamente', 'success');
      },
      error: (error) => {
        Swal.fire('Error', 'Error al actualizar el perfil: ' + (error.error?.message || 'Error desconocido'), 'error');
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
    if (!currentUser) return;
    
    Swal.fire({
      title: '¿Desactivar cuenta?',
      text: '¿Estás seguro de que deseas desactivar tu cuenta? Esta acción te cerrará la sesión y no podrás ingresar hasta que sea reactivada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, desactivar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deleteUser(currentUser.id).subscribe({
          next: () => {
            Swal.fire('Desactivada', 'Cuenta desactivada exitosamente.', 'success').then(() => {
              this.cerrarSesion();
            });
          },
          error: (error) => {
            Swal.fire('Error', 'Error al eliminar la cuenta: ' + (error.error?.message || 'Error desconocido'), 'error');
            console.error('Delete account error:', error);
          }
        });
      }
    });
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
    this.mascotasService.getHistorialByMascota(petId).subscribe({
      next: (res) => {
        if (res && res.consultas) {
          this.historialClinico = res.consultas.map((c: any) => ({
            id: c.id,
            petId: petId,
            fecha: c.fechaConsulta,
            tipo: c.motivoConsulta ? c.motivoConsulta.toLowerCase().includes('vacuna') ? 'vacuna' : c.motivoConsulta.toLowerCase().includes('cirugia') ? 'cirugia' : c.motivoConsulta.toLowerCase().includes('emergencia') ? 'emergencia' : 'consulta' : 'consulta',
            veterinario: 'Veterinario',
            diagnostico: c.diagnostico,
            tratamiento: c.tratamiento || c.medicamentos,
            notas: c.observaciones || c.sintomas
          }));
        } else {
          this.historialClinico = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando el historial:', err);
        this.historialClinico = [];
        this.cdr.detectChanges();
      }
    });
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
    Swal.fire('¡Éxito!', 'Registro clínico guardado exitosamente', 'success');
  }

  eliminarHistorial(id: number): void {
    Swal.fire({
      title: '¿Eliminar registro?',
      text: '¿Estás seguro de eliminar este registro clínico?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.historialClinico = this.historialClinico.filter(h => h.id !== id);
        this.guardarHistorialEnStorage();
        Swal.fire('Eliminado', 'Registro clínico eliminado', 'success');
      }
    });
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

  cambiarPassword(): void {
    if (!this.newPassword || this.newPassword.length < 6) {
      Swal.fire('Atención', 'La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Usar FormData para que sea compatible con el backend (multer)
    const formData = new FormData();
    formData.append('password', this.newPassword);

    this.usersService.updateUser(currentUser.id, formData).subscribe({
      next: () => {
        Swal.fire('¡Actualizada!', 'Contraseña actualizada correctamente. Por seguridad, debes iniciar sesión de nuevo.', 'success').then(() => {
          this.newPassword = '';
          this.cerrarSesion(); // Cerrar sesión tras cambiar contraseña
        });
      },
      error: (err) => {
        const errorMsg = err.error?.message;
        const detail = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
        Swal.fire('Error', 'Error al cambiar la contraseña: ' + (detail || err.message), 'error');
      }
    });
  }
}
