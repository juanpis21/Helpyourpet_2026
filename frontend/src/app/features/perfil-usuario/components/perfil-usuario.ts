import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { MascotasService } from '../services/mascotas.service';
import { PublicacionesService } from '../../inicio/services/publicaciones.service';
import { PreloaderComponent } from '../../../shared/components/preloader/preloader';
import { TicketsService } from '../../../core/services/tickets.service';
import type { CreateTicketDto } from '../../../core/services/tickets.service';
import { environment } from '../../../../environments/environment';

interface Mascota {
  id: number;
  name: string;
  species: string;
  breed: string;
  age: any;
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
  role?: { id: number; name: string; description: string };
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
export class PerfilUsuario implements OnInit, OnDestroy {
  apiUrl = environment.apiUrl;
  seccionActiva = 'dashboard';
  sidebarAbierto = true;
  darkMode = false;
  private themeSubscription!: Subscription;
  activePubMenuId: number | null = null;
  tabPublicacionesActiva = 'propias';
  
  // Purchases (Mis Compras) properties
  misCompras: any[] = [];
  comprasFiltradas: any[] = [];
  tabComprasActiva = 'todas';
  pageCompras = 1;
  limitCompras = 4;
  showVerCompraModal = false;
  selectedCompraForModal: any = null;
  sortOption = 'masRecientes'; // 'masRecientes', 'masAntiguas', 'mayorTotal', 'menorTotal'

  togglePubMenu(id: number, event: Event): void {
    event.stopPropagation();
    this.activePubMenuId = this.activePubMenuId === id ? null : id;
  }

  setTabPublicaciones(tab: string): void {
    this.tabPublicacionesActiva = tab;
    this.pagePublicaciones = 1;
  }

  getPublicacionesPropias(): any[] {
    return this.publicaciones.filter(p => !p.sharedFromId && !p.sharedFrom);
  }

  getPublicacionesCompartidas(): any[] {
    return this.publicaciones.filter(p => p.sharedFromId || p.sharedFrom);
  }

  getPublicacionesPropiasCount(): number {
    return this.getPublicacionesPropias().length;
  }

  getPublicacionesCompartidasCount(): number {
    return this.getPublicacionesCompartidas().length;
  }

  getPublicacionesFiltradas(): any[] {
    if (this.tabPublicacionesActiva === 'compartidas') {
      return this.getPublicacionesCompartidas();
    }
    return this.getPublicacionesPropias();
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

  // Pagination State
  pageMascotas = 1;
  limitMascotas = 6;
  pageHistorial = 1;
  limitHistorial = 5;
  pagePublicaciones = 1;
  limitPublicaciones = 6;

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

  // Citas Médicas
  misCitas: any[] = [];
  pageCitas = 1;
  limitCitas = 5;
  showNuevaCitaModal = false;
  veterinariasDisponibles: any[] = [];
  veterinariosDisponibles: any[] = [];
  serviciosDisponibles: any[] = [];
  veterinariosFiltrados: any[] = [];
  serviciosFiltrados: any[] = [];
  horasDisponibles: string[] = [];
  cargandoHoras = false;
  minDate: string = '';
  nuevaCita: any = {
    veterinariaId: 0,
    servicioId: 0,
    motivo: '',
    fechaSolo: '',
    horaSolo: '',
    mascotaId: 0,
    idVeterinario: null
  };

  // Ticket modal
  showTicketModal: boolean = false;
  showVerMascotaModal: boolean = false;
  selectedMascotaForModal: any = null;
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
    private route: ActivatedRoute,
    private themeService: ThemeService,
    private authService: AuthService,
    private usersService: UsersService,
    private mascotasService: MascotasService,
    private publicacionesService: PublicacionesService,
    private cdr: ChangeDetectorRef,
    private ticketsService: TicketsService,
    private http: HttpClient
  ) { }

  formatPetAge(ageInput: any): string {
    if (ageInput === undefined || ageInput === null) return 'N/A';
    if (typeof ageInput === 'string' && /[a-zA-Z]/.test(ageInput)) {
      return ageInput;
    }
    const age = Number(ageInput);
    if (isNaN(age)) return ageInput || 'N/A';
    if (age === 0) return '0 años';
    if (age % 1 === 0) {
      return `${age} ${age === 1 ? 'año' : 'años'}`;
    }
    const years = Math.floor(age);
    const months = Math.round((age - years) * 12);
    if (years === 0) {
      return `${months} ${months === 1 ? 'mes' : 'meses'}`;
    }
    return `${years} ${years === 1 ? 'año' : 'años'} y ${months} ${months === 1 ? 'mes' : 'meses'}`;
  }

  ngOnInit(): void {
    this.darkMode = this.themeService.isDarkMode;
    this.themeSubscription = this.themeService.darkMode$.subscribe(dark => {
      this.darkMode = dark;
      this.renderCharts();
    });

    // Verificar si viene de un pago exitoso de Stripe
    if (sessionStorage.getItem('stripePaymentSuccess') === 'true') {
      this.cambiarSeccion('compras');
      sessionStorage.removeItem('stripePaymentSuccess');
    }

    // Leer query param 'seccion' para navegar directamente (ej. desde Stripe redirect)
    this.route.queryParams.subscribe(params => {
      if (params['seccion']) {
        this.cambiarSeccion(params['seccion']);
        // Limpiar query params de la URL
        this.router.navigate([], { queryParams: {}, replaceUrl: true });
      }
    });

    this.initializeUserData();
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth >= 992) {
      this.sidebarAbierto = true;
    }
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
          this.loadMyTickets(),
          this.cargarMisCitas()
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

      await this.cargarHistorialActividades();
      this.renderCharts();
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
          imagen: avatar && avatar.startsWith('/uploads/') ? `${this.apiUrl}${avatar}` : avatar,
          roleId: currentUser.roleId,
          role: currentUser.role
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
              foto: m.foto && m.foto.startsWith('/uploads/') ? `${this.apiUrl}${m.foto}` : m.foto
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
            this.publicaciones = publicaciones.map(pub => {
              return {
                ...pub,
                imagen: pub.imagen && pub.imagen.startsWith('/uploads/') ? `${this.apiUrl}${pub.imagen}` : pub.imagen,
                likes: pub.likesUserIds ? pub.likesUserIds.length : 0,
                comentariosCount: pub.comentarios ? pub.comentarios.length : 0,
                sharedFrom: pub.sharedFrom ? {
                  ...pub.sharedFrom,
                  imagen: pub.sharedFrom.imagen && pub.sharedFrom.imagen.startsWith('/uploads/') ? `${this.apiUrl}${pub.sharedFrom.imagen}` : pub.sharedFrom.imagen,
                  autor: pub.sharedFrom.autor ? {
                    ...pub.sharedFrom.autor,
                    avatar: pub.sharedFrom.autor.avatar && pub.sharedFrom.autor.avatar.startsWith('/uploads/') ? `${this.apiUrl}${pub.sharedFrom.autor.avatar}` : pub.sharedFrom.autor.avatar
                  } : undefined
                } : undefined
              };
            });
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

  // Publication edit state
  editingPublicacion: any = null;
  editingPublicacionImage: File | null = null;
  editingPublicacionImagePreview: string | null = null;
  showEditarPublicacionModal = false;

  abrirEditarPublicacionModal(pub: any): void {
    this.closeAllMenus();
    this.editingPublicacion = { ...pub };
    this.editingPublicacionImage = null;
    this.editingPublicacionImagePreview = pub.imagen && pub.imagen.startsWith('/uploads/') ? this.apiUrl + pub.imagen : pub.imagen;
    this.showEditarPublicacionModal = true;
  }

  closeEditarPublicacionModal(): void {
    console.log('🔒 Cerrando modal de edición de publicación');
    this.showEditarPublicacionModal = false;
    this.editingPublicacion = null;
    this.editingPublicacionImage = null;
    this.editingPublicacionImagePreview = null;
    this.cdr.detectChanges();
  }

  onPublicacionImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.editingPublicacionImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.editingPublicacionImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarPublicacionImagen(): void {
    this.editingPublicacionImage = null;
    this.editingPublicacionImagePreview = null;
  }

  guardarEdicionPublicacion(): void {
    if (!this.editingPublicacion.descripcion || !this.editingPublicacion.descripcion.trim()) {
      Swal.fire('Error', 'La descripción no puede estar vacía', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', this.editingPublicacion.descripcion);
    if (this.editingPublicacionImage) {
      formData.append('imagen', this.editingPublicacionImage, this.editingPublicacionImage.name);
    }

    this.publicacionesService.actualizarPublicacion(this.editingPublicacion.id, formData).subscribe({
      next: (response) => {
        console.log('✅ Publicación actualizada:', response);
        this.closeEditarPublicacionModal();
        this.cargarPublicacionesUsuario();
        Swal.fire('¡Éxito!', 'Publicación actualizada correctamente', 'success');
      },
      error: (err) => {
        console.error('Error al actualizar publicación:', err);
        Swal.fire('Error', 'Error al actualizar la publicación', 'error');
      }
    });
  }

  // UI Methods
  cambiarSeccion(seccion: string): void {
    this.seccionActiva = seccion;
    if (seccion === 'tickets') {
      this.loadMyTickets();
    }
    if (seccion === 'citas') {
      this.cargarMisCitas();
      this.cargarDatosCita();
    }
    if (seccion === 'compras') {
      this.cargarMisCompras();
    }
    if (seccion === 'dashboard') {
      this.cargarHistorialActividades().then(() => {
        this.renderCharts();
      });
    }
  }

  loadMyTickets(): void {
    this.ticketsService.getMyTickets().subscribe({
      next: (tickets) => this.misTickets = tickets,
      error: (err) => console.error('Error loading my tickets:', err)
    });
  }

  deleteTicket(ticketId: number): void {
    Swal.fire({
      title: '¿Eliminar ticket?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ticketsService.delete(ticketId).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El ticket ha sido eliminado', 'success');
            this.loadMyTickets();
          },
          error: (err) => {
            console.error('Error deleting ticket:', err);
            Swal.fire('Error', 'No se pudo eliminar el ticket', 'error');
          }
        });
      }
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
    return this.usuario.role?.name || 'Usuario';
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

  verMascota(mascota: any): void {
    this.selectedMascotaForModal = mascota;
    this.showVerMascotaModal = true;
  }

  closeVerMascotaModal(): void {
    this.showVerMascotaModal = false;
    this.selectedMascotaForModal = null;
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
    this.pageHistorial = 1;
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
            veterinario: c.veterinario || 'Veterinario Especializado',
            diagnostico: c.diagnostico,
            tratamiento: c.tratamiento || c.medicamentos || 'No especificado',
            notas: c.observaciones || c.sintomas || 'Sin observaciones adicionales'
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

  showDetalleHistorialModal: boolean = false;
  detalleHistorial: HistorialClinico | null = null;

  verDetalleHistorial(registro: HistorialClinico): void {
    const icon = this.getHistorialIcon(registro.tipo);
    const tipoLabel = this.getHistorialTipoLabel(registro.tipo);
    const petName = this.getNombreMascotaSeleccionada();
    const fechaFormatted = new Date(registro.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });

    Swal.fire({
      title: `<div class="modal-premium-header ${registro.tipo}">
                <div class="header-main">
                  <div class="icon-circle">
                    <i class="${icon}"></i>
                  </div>
                  <div class="header-text">
                    <span class="pet-badge">${petName}</span>
                    <h3>${tipoLabel}</h3>
                  </div>
                </div>
                <div class="header-date">
                  <i class="fas fa-calendar-alt"></i> ${fechaFormatted}
                </div>
              </div>`,
      html: `
        <div class="modal-premium-body">
          <div class="info-grid">
            <div class="info-card">
              <div class="card-icon"><i class="fas fa-user-md"></i></div>
              <div class="card-content">
                <span class="label">VETERINARIO</span>
                <span class="value">${registro.veterinario}</span>
              </div>
            </div>
            <div class="info-card">
              <div class="card-icon"><i class="fas fa-fingerprint"></i></div>
              <div class="card-content">
                <span class="label">ID REGISTRO</span>
                <span class="value">#${registro.id}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-title">
              <i class="fas fa-notes-medical"></i>
              <span>Diagnóstico Clínico</span>
            </div>
            <div class="section-content highlight">
              ${registro.diagnostico}
            </div>
          </div>

          <div class="detail-section">
            <div class="section-title">
              <i class="fas fa-pills"></i>
              <span>Tratamiento y Medicación</span>
            </div>
            <div class="section-content normal">
              ${registro.tratamiento}
            </div>
          </div>

          <div class="detail-section" ${!registro.notas ? 'style="display:none;"' : ''}>
            <div class="section-title">
              <i class="fas fa-sticky-note"></i>
              <span>Observaciones del Especialista</span>
            </div>
            <div class="section-content notes">
              ${registro.notas}
            </div>
          </div>
        </div>
      `,
      showCloseButton: false, // Ocultar el por defecto, agregué uno personalizado en el header
      confirmButtonText: '<i class="fas fa-check"></i> ENTENDIDO',
      buttonsStyling: false,
      customClass: {
        popup: 'premium-swal-popup',
        title: 'premium-swal-title',
        htmlContainer: 'premium-swal-html',
        confirmButton: 'premium-swal-button',
        actions: 'premium-swal-actions'
      },
      width: '650px',
      showClass: {
        popup: 'animate__animated animate__fadeInDown animate__faster'
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp animate__faster'
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

  // ===== PAGINATION HELPMETHODS =====

  // Mascotas
  getPaginatedMascotas(): any[] {
    const maxPages = this.getTotalPagesMascotas();
    if (this.pageMascotas > maxPages && maxPages > 0) {
      this.pageMascotas = maxPages;
    }
    const startIndex = (this.pageMascotas - 1) * this.limitMascotas;
    return this.mascotas.slice(startIndex, startIndex + this.limitMascotas);
  }

  getTotalPagesMascotas(): number {
    return Math.ceil(this.mascotas.length / this.limitMascotas);
  }

  nextPageMascotas(): void {
    if (this.pageMascotas < this.getTotalPagesMascotas()) {
      this.pageMascotas++;
    }
  }

  prevPageMascotas(): void {
    if (this.pageMascotas > 1) {
      this.pageMascotas--;
    }
  }

  // Historial Clínico
  getPaginatedHistorial(): any[] {
    const maxPages = this.getTotalPagesHistorial();
    if (this.pageHistorial > maxPages && maxPages > 0) {
      this.pageHistorial = maxPages;
    }
    const startIndex = (this.pageHistorial - 1) * this.limitHistorial;
    return this.historialClinico.slice(startIndex, startIndex + this.limitHistorial);
  }

  getTotalPagesHistorial(): number {
    return Math.ceil(this.historialClinico.length / this.limitHistorial);
  }

  nextPageHistorial(): void {
    if (this.pageHistorial < this.getTotalPagesHistorial()) {
      this.pageHistorial++;
    }
  }

  prevPageHistorial(): void {
    if (this.pageHistorial > 1) {
      this.pageHistorial--;
    }
  }

  // Publicaciones
  getPaginatedPublicaciones(): any[] {
    const list = this.getPublicacionesFiltradas();
    const maxPages = this.getTotalPagesPublicaciones();
    if (this.pagePublicaciones > maxPages && maxPages > 0) {
      this.pagePublicaciones = maxPages;
    }
    const startIndex = (this.pagePublicaciones - 1) * this.limitPublicaciones;
    return list.slice(startIndex, startIndex + this.limitPublicaciones);
  }

  getTotalPagesPublicaciones(): number {
    const list = this.getPublicacionesFiltradas();
    return Math.ceil(list.length / this.limitPublicaciones);
  }

  nextPagePublicaciones(): void {
    if (this.pagePublicaciones < this.getTotalPagesPublicaciones()) {
      this.pagePublicaciones++;
    }
  }

  prevPagePublicaciones(): void {
    if (this.pagePublicaciones > 1) {
      this.pagePublicaciones--;
    }
  }

  // ===== DASHBOARD METRICS, CHARTS & ACTIVITY HISTORY =====
  barChart: any = null;
  donutChart: any = null;
  actividades: any[] = [];
  pageActividades = 1;
  limitActividades = 5;

  renderCharts(): void {
    if (this.seccionActiva !== 'dashboard') return;

    setTimeout(() => {
      this.renderBarChart();
      this.renderDonutChart();
    }, 150);
  }

  renderBarChart(): void {
    const canvas = document.getElementById('barChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.barChart) {
      this.barChart.destroy();
    }

    const monthStats: { [key: string]: { publications: number, likes: number, comments: number } } = {};

    this.publicaciones.forEach(pub => {
      const date = pub.createdAt ? new Date(pub.createdAt) : new Date();
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthStats[month]) {
        monthStats[month] = { publications: 0, likes: 0, comments: 0 };
      }
      monthStats[month].publications++;
      monthStats[month].likes += pub.likesUserIds ? pub.likesUserIds.length : 0;
      monthStats[month].comments += pub.comentarios ? pub.comentarios.length : 0;
    });

    const sortedMonths = Object.keys(monthStats).sort();
    if (sortedMonths.length === 0) {
      const date = new Date();
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthStats[month] = { publications: 0, likes: 0, comments: 0 };
      sortedMonths.push(month);
    }

    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const labels = sortedMonths.map(m => {
      const [year, month] = m.split('-');
      return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
    });

    const publicationsData = sortedMonths.map(m => monthStats[m].publications);
    const likesData = sortedMonths.map(m => monthStats[m].likes);
    const commentsData = sortedMonths.map(m => monthStats[m].comments);

    this.barChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Publicaciones',
            data: publicationsData,
            backgroundColor: '#1d3976',
            borderRadius: 6,
          },
          {
            label: 'Likes',
            data: likesData,
            backgroundColor: '#ef4444',
            borderRadius: 6,
          },
          {
            label: 'Comentarios',
            data: commentsData,
            backgroundColor: '#66B566',
            borderRadius: 6,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                family: "'Fredoka', sans-serif",
                weight: 'bold'
              },
              color: this.darkMode ? '#f3f4f6' : '#1f2937'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: {
                family: "'Fredoka', sans-serif"
              },
              color: this.darkMode ? '#9ca3af' : '#4b5563'
            },
            grid: {
              color: this.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'
            }
          },
          x: {
            ticks: {
              font: {
                family: "'Fredoka', sans-serif"
              },
              color: this.darkMode ? '#9ca3af' : '#4b5563'
            },
            grid: {
              display: false
            }
          }
        }
      }
    });
  }

  renderDonutChart(): void {
    const canvas = document.getElementById('donutChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.donutChart) {
      this.donutChart.destroy();
    }

    let perros = 0;
    let gatos = 0;
    let otros = 0;

    this.mascotas.forEach(pet => {
      const species = (pet.species || '').toLowerCase();
      if (species.includes('perro') || species.includes('can')) {
        perros++;
      } else if (species.includes('gato') || species.includes('felin')) {
        gatos++;
      } else {
        otros++;
      }
    });

    const hasData = (perros + gatos + otros) > 0;
    const dataValues = hasData ? [perros, gatos, otros] : [1, 1, 1];
    const dataLabels = hasData ? ['Perros', 'Gatos', 'Otros'] : ['Sin Mascotas', '', ''];

    this.donutChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: dataLabels,
        datasets: [
          {
            data: dataValues,
            backgroundColor: hasData 
              ? ['#1d3976', '#66B566', '#FFE082'] 
              : ['#e5e7eb', '#f3f4f6', '#f9fafb'],
            borderWidth: 2,
            borderColor: this.darkMode ? '#1f2937' : '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: "'Fredoka', sans-serif",
                weight: 'bold'
              },
              color: this.darkMode ? '#f3f4f6' : '#1f2937'
            }
          }
        }
      }
    });
  }

  async cargarHistorialActividades(): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    const list: any[] = [];

    // 1. Registro de mascotas
    this.mascotas.forEach(pet => {
      list.push({
        fecha: pet.createdAt ? new Date(pet.createdAt) : new Date(),
        accion: 'Registro de mascota',
        descripcion: `Registraste a tu mascota ${pet.name} (${pet.species})`
      });
    });

    // 2. Nuevas publicaciones y compartidos
    this.publicaciones.forEach(pub => {
      const isShare = pub.sharedFromId || pub.sharedFrom;
      if (isShare) {
        list.push({
          fecha: pub.createdAt ? new Date(pub.createdAt) : new Date(),
          accion: 'Publicación compartida',
          descripcion: `Compartiste la publicación de ${pub.sharedFrom?.autor?.fullName || 'Usuario'}`
        });
      } else {
        list.push({
          fecha: pub.createdAt ? new Date(pub.createdAt) : new Date(),
          accion: 'Nueva publicación',
          descripcion: `Publicaste: "${pub.descripcion.substring(0, 60)}${pub.descripcion.length > 60 ? '...' : ''}"`
        });
      }
    });

    // 3. Comentarios realizados
    this.publicaciones.forEach(pub => {
      if (pub.comentarios) {
        pub.comentarios.forEach((c: any) => {
          if (c.autorId === currentUser.id) {
            list.push({
              fecha: c.createdAt ? new Date(c.createdAt) : new Date(),
              accion: 'Comentario realizado',
              descripcion: `Comentaste en una publicación: "${c.contenido.substring(0, 60)}${c.contenido.length > 60 ? '...' : ''}"`
            });
          }
        });
      }
    });

    // 4. Auditorías desde el Backend
    try {
      const logs = await this.http.get<any[]>(`${this.apiUrl}/audit-logs/user/${currentUser.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      }).toPromise();

      if (logs && Array.isArray(logs)) {
        logs.forEach(log => {
          const date = log.createdAt ? new Date(log.createdAt) : new Date();
          if (log.entity === 'User' || (log.action === 'UPDATE' && log.entity === 'User')) {
            list.push({
              fecha: date,
              accion: 'Actualización de perfil',
              descripcion: log.description || 'Actualizaste la información de tu perfil'
            });
          }
        });
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }

    // Ordenar de más reciente a más antigua
    this.actividades = list.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }

  getPaginatedActividades(): any[] {
    const startIndex = (this.pageActividades - 1) * this.limitActividades;
    return this.actividades.slice(startIndex, startIndex + this.limitActividades);
  }

  getTotalPagesActividades(): number {
    return Math.ceil(this.actividades.length / this.limitActividades);
  }

  prevPageActividades(): void {
    if (this.pageActividades > 1) {
      this.pageActividades--;
    }
  }

  nextPageActividades(): void {
    if (this.pageActividades < this.getTotalPagesActividades()) {
      this.pageActividades++;
    }
  }

  // ===== CITAS MÉDICAS =====

  cargarMisCitas(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    const token = localStorage.getItem('access_token');
    this.http.get<any[]>(`${this.apiUrl}/citas/usuario/${currentUser.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (citas) => {
        const ahora = new Date();
        const proximas = citas.filter(c => c.estado === 'Programada' && new Date(c.fechaHora) >= ahora);
        const pasadas = citas.filter(c => c.estado !== 'Programada' || new Date(c.fechaHora) < ahora);
        proximas.sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
        pasadas.sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
        this.misCitas = [...proximas, ...pasadas];
        this.pageCitas = 1;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar citas:', err)
    });
  }

  cargarDatosCita(): void {
    const token = localStorage.getItem('access_token');
    const currentUser = this.authService.getCurrentUser() as any;
    
    // Cargar Veterinarias
    this.http.get<any[]>(`${this.apiUrl}/veterinarias`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (vets) => {
        let veterinariasActivas = vets.filter(v => v.isActive);
        
        // Cargar Veterinarios
        this.http.get<any[]>(`${this.apiUrl}/perfiles-veterinarios`, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (perfiles) => {
            this.veterinariosDisponibles = perfiles.filter(p => p.isActive && p.usuario);
            
            // FILTRAR VETERINARIAS POR EL VETERINARIO QUE REGISTRÓ AL USUARIO
            if (currentUser && currentUser.createdById) {
              const perfilCreador = this.veterinariosDisponibles.find(p => p.usuario.id === currentUser.createdById);
              if (perfilCreador && perfilCreador.veterinariaPrincipal) {
                veterinariasActivas = veterinariasActivas.filter(v => v.id === perfilCreador.veterinariaPrincipal.id);
              }
            }
            
            this.veterinariasDisponibles = veterinariasActivas;
            
            // Si solo queda 1 veterinaria (por el filtro), seleccionarla automáticamente
            if (this.veterinariasDisponibles.length === 1) {
              this.nuevaCita.veterinariaId = this.veterinariasDisponibles[0].id;
            }

            // Cargar Servicios
            this.http.get<any[]>(`${this.apiUrl}/servicios`, {
              headers: { Authorization: `Bearer ${token}` }
            }).subscribe({
              next: (servs) => {
                this.serviciosDisponibles = servs.filter(s => s.isActive);
                
                if (this.nuevaCita.veterinariaId) {
                  this.onVeterinariaChange();
                } else {
                  this.veterinariosFiltrados = [];
                  this.serviciosFiltrados = [];
                }
                
                this.cdr.detectChanges();
              },
              error: (err) => console.error('Error al cargar servicios:', err)
            });

          },
          error: (err) => console.error('Error al cargar veterinarios:', err)
        });
      },
      error: (err) => console.error('Error al cargar veterinarias:', err)
    });
  }

  onVeterinariaChange(): void {
    const vetId = Number(this.nuevaCita.veterinariaId);
    
    // Filtrar Veterinarios por veterinaria
    this.veterinariosFiltrados = this.veterinariosDisponibles.filter(v =>
      v.veterinariaPrincipal && v.veterinariaPrincipal.id === vetId
    );
    
    // Filtrar Servicios por veterinaria
    this.serviciosFiltrados = this.serviciosDisponibles.filter(s =>
      s.veterinariaId === vetId || (s.veterinaria && s.veterinaria.id === vetId)
    );

    // Resetear selecciones dependientes
    this.nuevaCita.idVeterinario = null;
    this.nuevaCita.servicioId = 0;
    this.nuevaCita.motivo = '';
    this.nuevaCita.fechaSolo = '';
    this.nuevaCita.horaSolo = '';
    this.horasDisponibles = [];
  }

  onServicioChange(): void {
    const servId = Number(this.nuevaCita.servicioId);
    const servicio = this.serviciosDisponibles.find(s => s.id === servId);
    if (servicio) {
      this.nuevaCita.motivo = servicio.nombre;
    } else {
      this.nuevaCita.motivo = '';
    }
    // Resetear fecha y hora al cambiar servicio
    this.nuevaCita.fechaSolo = '';
    this.nuevaCita.horaSolo = '';
    this.horasDisponibles = [];
  }

  onFechaChange(): void {
    this.nuevaCita.horaSolo = '';
    this.horasDisponibles = [];
    const fecha = this.nuevaCita.fechaSolo;
    if (!fecha) return;

    // Si hay veterinario seleccionado, cargar horas de ese veterinario
    // Si no, tomar el primero filtrado o dejar vacío
    const vetUserId = this.nuevaCita.idVeterinario
      ? Number(this.nuevaCita.idVeterinario)
      : (this.veterinariosFiltrados.length > 0 ? this.veterinariosFiltrados[0].usuario.id : null);

    if (vetUserId) {
      this.cargarHorasDisponibles(vetUserId, fecha);
    }
  }

  onVeterinarioCitaChange(): void {
    this.nuevaCita.horaSolo = '';
    this.horasDisponibles = [];
    const fecha = this.nuevaCita.fechaSolo;
    const vetUserId = this.nuevaCita.idVeterinario ? Number(this.nuevaCita.idVeterinario) : null;
    if (vetUserId && fecha) {
      this.cargarHorasDisponibles(vetUserId, fecha);
    }
  }

  cargarHorasDisponibles(veterinarioId: number, fecha: string): void {
    const token = localStorage.getItem('access_token');
    const servicioId = this.nuevaCita.servicioId ? Number(this.nuevaCita.servicioId) : undefined;
    this.cargandoHoras = true;
    this.horasDisponibles = [];
    this.cdr.detectChanges();

    let url = `${this.apiUrl}/citas/horarios-disponibles?veterinarioId=${veterinarioId}&fecha=${fecha}`;
    if (servicioId) url += `&servicioId=${servicioId}`;

    this.http.get<string[]>(url, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (horas) => {
        this.horasDisponibles = horas;
        this.cargandoHoras = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar horarios:', err);
        this.cargandoHoras = false;
        this.cdr.detectChanges();
      }
    });
  }

  getPaginatedCitas(): any[] {
    const startIndex = (this.pageCitas - 1) * this.limitCitas;
    return this.misCitas.slice(startIndex, startIndex + this.limitCitas);
  }

  getTotalPagesCitas(): number {
    return Math.ceil(this.misCitas.length / this.limitCitas);
  }

  nextPageCitas(): void {
    if (this.pageCitas < this.getTotalPagesCitas()) {
      this.pageCitas++;
    }
  }

  prevPageCitas(): void {
    if (this.pageCitas > 1) {
      this.pageCitas--;
    }
  }

  openNuevaCitaModal(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;

    this.nuevaCita = {
      veterinariaId: 0,
      servicioId: 0,
      motivo: '',
      fechaSolo: '',
      horaSolo: '',
      mascotaId: this.mascotas.length > 0 ? this.mascotas[0].id : 0,
      idVeterinario: null,
      usuarioId: currentUser.id
    };
    this.horasDisponibles = [];
    this.cargandoHoras = false;
    if (this.veterinariasDisponibles.length === 0) {
      this.cargarDatosCita();
    }
    this.showNuevaCitaModal = true;
  }

  closeNuevaCitaModal(): void {
    this.showNuevaCitaModal = false;
  }

  guardarNuevaCita(): void {
    if (!this.nuevaCita.motivo || !this.nuevaCita.fechaSolo || !this.nuevaCita.horaSolo || !this.nuevaCita.mascotaId) {
      Swal.fire('Atención', 'Por favor completa todos los campos obligatorios', 'warning');
      return;
    }
    const fechaHora = new Date(`${this.nuevaCita.fechaSolo}T${this.nuevaCita.horaSolo}`);
    if (fechaHora <= new Date()) {
      Swal.fire('Atención', 'La fecha y hora de la cita deben ser futuras', 'warning');
      return;
    }
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;
    const token = localStorage.getItem('access_token');
    const payload: any = {
      motivo: this.nuevaCita.motivo,
      fechaHora: fechaHora.toISOString(),
      mascotaId: Number(this.nuevaCita.mascotaId),
      usuarioId: currentUser.id
    };
    if (this.nuevaCita.servicioId) {
      payload.servicioId = Number(this.nuevaCita.servicioId);
    }
    if (this.nuevaCita.veterinariaId) {
      payload.veterinariaId = Number(this.nuevaCita.veterinariaId);
    }
    if (this.nuevaCita.idVeterinario) {
      payload.idVeterinario = Number(this.nuevaCita.idVeterinario);
    }
    this.http.post<any>(`${this.apiUrl}/citas`, payload, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    }).subscribe({
      next: () => {
        Swal.fire('¡Cita creada!', 'Tu cita ha sido programada exitosamente', 'success');
        this.closeNuevaCitaModal();
        this.cargarMisCitas();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al crear la cita';
        Swal.fire('Error', Array.isArray(msg) ? msg.join(', ') : msg, 'error');
      }
    });
  }

  cancelarCita(cita: any): void {
    Swal.fire({
      title: '¿Cancelar cita?',
      text: `¿Estás seguro de cancelar la cita del ${new Date(cita.fechaHora).toLocaleDateString('es-ES')}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const token = localStorage.getItem('access_token');
        this.http.patch<any>(`${this.apiUrl}/citas/${cita.id}`, { estado: 'Cancelada' }, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        }).subscribe({
          next: () => {
            Swal.fire('Cancelada', 'La cita ha sido cancelada', 'success');
            this.cargarMisCitas();
          },
          error: (err) => {
            const msg = err.error?.message || 'Error al cancelar la cita';
            Swal.fire('Error', Array.isArray(msg) ? msg.join(', ') : msg, 'error');
          }
        });
      }
    });
  }

  getVeterinarioNombre(cita: any): string {
    if (!cita.veterinario) return 'Sin asignar';
    const v = cita.veterinario;
    return [v.firstName, v.lastName].filter(Boolean).join(' ') || v.fullName || v.email || 'Veterinario';
  }

  getVeterinariaNombre(cita: any): string {
    if (!cita.veterinaria) return 'Sin asignar';
    return cita.veterinaria.nombre || 'Veterinaria';
  }

  // ===== PURCHASES / MIS COMPRAS METHODS =====

  cargarMisCompras(): void {
    const token = localStorage.getItem('access_token');
    this.http.get<any[]>(`${this.apiUrl}/ventas/mis-compras`, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (compras) => {
        this.misCompras = compras.map(c => {
          c.total = Number(c.total);
          c.subtotal = Number(c.subtotal);
          if (c.detalles) {
            c.detalles = c.detalles.map((d: any) => {
              if (d.producto && d.producto.imagen && d.producto.imagen.startsWith('/uploads/')) {
                d.producto.imagen = `${this.apiUrl}${d.producto.imagen}`;
              }
              return d;
            });
          }
          return c;
        });
        this.filtrarCompras();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar compras:', err)
    });
  }

  getComprasCount(estado: string): number {
    if (estado === 'todas') {
      return this.misCompras.length;
    }
    return this.misCompras.filter(c => (c.estado || 'Pendiente').toLowerCase() === estado.toLowerCase()).length;
  }

  filtrarCompras(): void {
    let filtered: any[];
    if (this.tabComprasActiva === 'todas') {
      filtered = [...this.misCompras];
    } else {
      filtered = this.misCompras.filter(c => 
        (c.estado || 'Pendiente').toLowerCase() === this.tabComprasActiva.toLowerCase()
      );
    }

    // Sorting
    switch (this.sortOption) {
      case 'masRecientes':
        filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        break;
      case 'masAntiguas':
        filtered.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        break;
      case 'mayorTotal':
        filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
        break;
      case 'menorTotal':
        filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
        break;
    }

    this.comprasFiltradas = filtered;
    this.pageCompras = 1;
  }

  setTabCompras(tab: string): void {
    this.tabComprasActiva = tab;
    this.filtrarCompras();
  }

  setSortOption(option: string): void {
    this.sortOption = option;
    this.filtrarCompras();
  }

  getPaginatedCompras(): any[] {
    const maxPages = this.getTotalPagesCompras();
    if (this.pageCompras > maxPages && maxPages > 0) {
      this.pageCompras = maxPages;
    }
    const startIndex = (this.pageCompras - 1) * this.limitCompras;
    return this.comprasFiltradas.slice(startIndex, startIndex + this.limitCompras);
  }

  getTotalPagesCompras(): number {
    return Math.ceil(this.comprasFiltradas.length / this.limitCompras);
  }

  nextPageCompras(): void {
    if (this.pageCompras < this.getTotalPagesCompras()) {
      this.pageCompras++;
    }
  }

  prevPageCompras(): void {
    if (this.pageCompras > 1) {
      this.pageCompras--;
    }
  }

  verDetalleCompra(compra: any): void {
    this.selectedCompraForModal = compra;
    this.showVerCompraModal = true;
  }

  closeVerCompraModal(): void {
    this.showVerCompraModal = false;
    this.selectedCompraForModal = null;
  }

  formatPrice(price: any): string {
    const num = Number(price);
    if (isNaN(num)) return '$0';
    return '$' + num.toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  formatOrderId(id: any): string {
    if (!id) return '00000';
    return String(id).padStart(5, '0');
  }
}
