import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { ThemeService } from '../../../core/services/theme.service';
import { PublicacionesService } from '../../inicio/services/publicaciones.service';
import { TicketsService } from '../../../core/services/tickets.service';
import type { CreateTicketDto } from '../../../core/services/tickets.service';
import { PreloaderComponent } from '../../../shared/components/preloader/preloader';

interface Mascota {
  id?: number;
  name: string;
  species: string;
  breed?: string;
  age: number;
  gender: string;
  color: string;
  weight: number;
  description?: string;
  ownerId?: number;
  foto?: string;
}

interface Cita {
  id?: number;
  fechaHora: string;
  motivo: string;
  estado: string;
  usuario?: any;
  mascota?: any;
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
  // Perfil Profesional (Veterinario)
  especialidad?: string;
  matricula?: string;
  aniosExperiencia?: number;
  nombreVeterinaria?: string;
}

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule, PreloaderComponent],
  templateUrl: './veterinario.html',
  styleUrl: './veterinario.scss',
})
export class Veterinario implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UsersService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  private publicacionesService = inject(PublicacionesService);
  private cdr = inject(ChangeDetectorRef);
  private ticketsService = inject(TicketsService);

  activeSection: string = 'dashboard';
  sidebarOpen: boolean = true;
  darkMode: boolean = false;
  today: Date = new Date();

  // Historial de Acciones
  historialCitas: any[] = [];
  historialLoading: boolean = false;
  historialSearchDate: string = '';
  historialPage: number = 1;
  historialPageSize: number = 10;

  // Datos
  vetUser: any = null;
  mascotas: any[] = [];
  usuarios: any[] = [];
  publicaciones: any[] = [];
  citas: any[] = [];

  usuario: Usuario = {
    id: 0, nombres: '', apellidos: '', correo: '', telefono: '',
    edad: 0, direccion: '', tipoDocumento: '', numDocumento: '',
    imagen: '', roleId: undefined
  };

  // Profile image handling
  selectedProfileFile: File | null = null;
  profileImagePreview: string | null = null;

  // Ticket modal
  showTicketModal: boolean = false;
  misTickets: any[] = [];
  newTicket: CreateTicketDto = {
    asunto: '',
    descripcion: '',
    prioridad: 'Media'
  };

  newPassword: string = '';

  toasts: any[] = [];

  // Gráficos
  growthChart: any;
  citasChart: any;

  // Mascotas
  searchTermMascotas: string = '';
  showAddPetModal: boolean = false;
  showAddUserModal: boolean = false;
  showAddCitaModal: boolean = false;
  showEditPetModal: boolean = false;
  showEditUserModal: boolean = false;

  // ─── HISTORIAS CLÍNICAS ─────────────────────────────────────────
  showNuevaConsultaModal: boolean = false;
  historiaActual: any = null;
  consultasActuales: any[] = [];
  hcSelectedOwnerId: number | null = null;
  hcSelectedPetId: number | null = null;
  hcMascotasFiltradas: any[] = [];
  hcLoading: boolean = false;

  // Paginación Mascotas
  petsCurrentPage: number = 1;
  petsPageSize: number = 20;

  // Paginación Usuarios
  usersCurrentPage: number = 1;
  usersPageSize: number = 20;
  hcEditando: boolean = false;
  hcEditForm: any = {};

  nuevaConsulta: any = {
    fechaConsulta: '',
    peso: null,
    temperatura: null,
    motivoConsulta: '',
    sintomas: '',
    diagnostico: '',
    tratamiento: '',
    medicamentos: '',
    observaciones: '',
    proximaCita: ''
  };
  // ────────────────────────────────────────────────────────────────
  
  editingUser: any = {
    firstName: '',
    lastName: '',
    documentType: '',
    documentNumber: '',
    phone: '',
    address: '',
    age: 18
  };
  
  editingPet: Mascota = {
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: 'M',
    color: '',
    weight: 0,
    description: '',
    ownerId: undefined
  };
  
  newPet: Mascota = {
    name: '',
    species: '',
    breed: '',
    age: 0,
    gender: 'M',
    color: '',
    weight: 0,
    description: '',
    ownerId: undefined
  };

  newUser: any = {
    firstName: '',
    lastName: '',
    documentType: 'Cédula',
    documentNumber: '',
    phone: '',
    address: '',
    age: 18
  };

  usuariosSinCuenta: any[] = [];
  searchTermUsuarios: string = '';
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  get filteredMascotas() {
    if (!this.searchTermMascotas.trim()) return this.mascotas;
    const term = this.searchTermMascotas.toLowerCase();
    return this.mascotas.filter(m =>
      m.name?.toLowerCase().includes(term) ||
      m.owner?.firstName?.toLowerCase().includes(term) ||
      m.owner?.lastName?.toLowerCase().includes(term)
    );
  }

  get paginatedMascotas() {
    const filtered = this.filteredMascotas;
    // Si el término de búsqueda cambia y la página actual queda fuera de rango, resetear a 1
    const totalPages = Math.ceil(filtered.length / this.petsPageSize);
    if (this.petsCurrentPage > totalPages && totalPages > 0) {
      this.petsCurrentPage = 1;
    }

    const startIndex = (this.petsCurrentPage - 1) * this.petsPageSize;
    return filtered.slice(startIndex, startIndex + this.petsPageSize);
  }

  get totalPetsPages() {
    return Math.ceil(this.filteredMascotas.length / this.petsPageSize);
  }

  nextPetsPage() {
    if (this.petsCurrentPage < this.totalPetsPages) {
      this.petsCurrentPage++;
      this.cdr.detectChanges();
    }
  }

  prevPetsPage() {
    if (this.petsCurrentPage > 1) {
      this.petsCurrentPage--;
      this.cdr.detectChanges();
    }
  }

  get filteredUsuarios() {
    if (!this.searchTermUsuarios.trim()) return this.usuariosSinCuenta;
    const term = this.searchTermUsuarios.toLowerCase();
    return this.usuariosSinCuenta.filter(u =>
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term) ||
      u.documentNumber?.toString().includes(term)
    );
  }

  get paginatedUsuarios() {
    const filtered = this.filteredUsuarios;
    const totalPages = Math.ceil(filtered.length / this.usersPageSize);
    if (this.usersCurrentPage > totalPages && totalPages > 0) {
      this.usersCurrentPage = 1;
    }

    const startIndex = (this.usersCurrentPage - 1) * this.usersPageSize;
    return filtered.slice(startIndex, startIndex + this.usersPageSize);
  }

  get totalUsersPages() {
    return Math.ceil(this.filteredUsuarios.length / this.usersPageSize);
  }

  // Getters para Historial de Acciones
  get filteredHistorial() {
    if (!this.historialSearchDate) return this.historialCitas;
    return this.historialCitas.filter(h => {
      if (!h.createdAt) return false;
      return h.createdAt.startsWith(this.historialSearchDate);
    });
  }

  get paginatedHistorial() {
    const start = (this.historialPage - 1) * this.historialPageSize;
    return this.filteredHistorial.slice(start, start + this.historialPageSize);
  }

  get historialTotalPages() {
    return Math.ceil(this.filteredHistorial.length / this.historialPageSize) || 1;
  }

  nextUsersPage() {
    if (this.usersCurrentPage < this.totalUsersPages) {
      this.usersCurrentPage++;
      this.cdr.detectChanges();
    }
  }

  prevUsersPage() {
    if (this.usersCurrentPage > 1) {
      this.usersCurrentPage--;
      this.cdr.detectChanges();
    }
  }

  newCita: any = {
    fecha: '',
    motivo: '',
    userId: null,
    petId: null
  };

  public readonly API_BASE = 'http://localhost:3000';

  ngOnInit(): void {
    this.vetUser = this.authService.getCurrentUser();
    this.darkMode = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.darkMode = dark);
    
    if (this.vetUser) {
      this.loadUserProfile();
      this.cargarDatos();
      this.cargarPublicacionesUsuario();
      this.loadMyTickets();
      this.loadHistorial();
    }
  }

  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
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

      // Si es veterinario, cargar su perfil profesional
      if (currentUser.roleId === 3) {
        this.http.get<any[]>(`${this.API_BASE}/perfiles-veterinarios/usuario/${currentUser.id}`, this.getHeaders())
          .subscribe({
            next: (perfiles) => {
              if (perfiles && perfiles.length > 0) {
                const perfil = perfiles[0];
                this.usuario.especialidad = perfil.especialidad;
                this.usuario.matricula = perfil.matricula;
                this.usuario.aniosExperiencia = perfil.aniosExperiencia;
                this.usuario.nombreVeterinaria = perfil.veterinariaPrincipal?.nombre || 'No asignada';
                this.cdr.detectChanges();
              }
            },
            error: (err) => console.error('Error al cargar perfil veterinario:', err)
          });
      }
    }
  }

  cargarPublicacionesUsuario(): void {
    if (this.vetUser && this.vetUser.id) {
      this.publicacionesService.getPublicacionesPorAutor(this.vetUser.id).subscribe({
        next: (publicaciones) => {
          this.publicaciones = publicaciones.map(pub => ({
            ...pub,
            imagen: pub.imagen && pub.imagen.startsWith('/uploads/') ? `http://localhost:3000${pub.imagen}` : pub.imagen
          }));
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar publicaciones:', err)
      });
    }
  }

  eliminarPublicacion(id: number): void {
    Swal.fire({
      title: '¿Eliminar publicación?',
      text: '¿Estás seguro de que quieres eliminar esta publicación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.publicacionesService.eliminarPublicacion(id).subscribe({
          next: () => {
            this.cargarPublicacionesUsuario();
            this.showToast('Publicación eliminada exitosamente', 'success');
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.showToast('Error al eliminar publicación: ' + (err.error?.message || err.message), 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

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

  guardarPerfil(): void {
    if (!this.vetUser) return;

    const formData = new FormData();
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

    this.userService.updateUser(this.vetUser.id, formData).subscribe({
      next: (response) => {
        this.authService.updateCurrentUser(response);
        this.vetUser = response;
        this.selectedProfileFile = null;
        this.showToast('Perfil actualizado correctamente', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.showToast('Error al actualizar el perfil: ' + (error.error?.message || error.message), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  eliminarCuenta(): void {
    if (!this.vetUser) return;
    Swal.fire({
      title: '¿Desactivar cuenta?',
      text: '¿Estás seguro de que deseas desactivar tu cuenta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.vetUser.id).subscribe({
          next: () => {
            this.showToast('Cuenta desactivada exitosamente.', 'success');
            this.cerrarSesion();
          },
          error: (error) => this.showToast('Error al eliminar la cuenta: ' + (error.error?.message || error.message), 'error')
        });
      }
    });
  }

  cambiarPassword(): void {
    if (!this.newPassword || this.newPassword.length < 6) {
      this.showToast('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Usar FormData para que sea compatible con el interceptor del backend
    const formData = new FormData();
    formData.append('password', this.newPassword);

    this.userService.updateUser(currentUser.id, formData).subscribe({
      next: () => {
        this.showToast('Contraseña actualizada correctamente. Por seguridad, debes iniciar sesión de nuevo.', 'success');
        this.newPassword = '';
        this.cerrarSesion(); // Cerrar sesión tras cambiar contraseña
      },
      error: (err) => {
        const errorMsg = err.error?.message;
        const detail = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
        this.showToast('Error al cambiar la contraseña: ' + (detail || err.message), 'error');
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.themeService.setDarkMode(false);
    this.router.navigate(['/login']);
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  cargarDatos(): void {
    this.cargarMascotas();
    this.cargarUsuarios();
    this.cargarUsuariosSinCuenta();
    this.cargarCitas();
  }

  setSection(section: string): void {
    this.activeSection = section;
    if (section === 'tickets') {
      this.loadMyTickets();
    } else if (section === 'dashboard') {
      this.loadHistorial();
      this.renderCharts();
    }
  }

  loadHistorial(): void {
    if (!this.vetUser || !this.vetUser.id) return;
    this.historialLoading = true;
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any[]>(`${this.API_BASE}/audit-logs/user/${this.vetUser.id}`, { headers }).subscribe({
      next: (data) => {
        this.historialCitas = data;
        this.historialLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading historial:', err);
        this.historialCitas = [];
        this.historialLoading = false;
      }
    });
  }

  getTipoCambioLabel(tipo: string): string {
    const map: { [key: string]: string } = {
      'CREATE': 'Creación',
      'UPDATE': 'Actualización',
      'DELETE': 'Eliminación',
      'LOGIN': 'Inicio Sesión',
      'LOGOUT': 'Cierre Sesión',
      'STATUS_CHANGE': 'Cambio Estado'
    };
    return map[tipo] || tipo;
  }

  getTipoCambioClass(tipo: string): string {
    const map: { [key: string]: string } = {
      'CREATE': 'tipo-creacion',
      'UPDATE': 'tipo-actualizacion',
      'DELETE': 'tipo-cancelacion',
      'LOGIN': 'tipo-completacion',
      'LOGOUT': 'tipo-actualizacion',
      'STATUS_CHANGE': 'tipo-completacion'
    };
    return map[tipo] || '';
  }

  formatDateCorrectly(dateStr: string): Date {
    if (!dateStr) return new Date();
    const hasTimezone = dateStr.includes('Z') || dateStr.includes('+') || (dateStr.includes('-') && dateStr.lastIndexOf('-') > 10);
    if (!hasTimezone) {
      return new Date(dateStr + 'Z');
    }
    return new Date(dateStr);
  }

  getFullImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/images/Default.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  }

  loadMyTickets(): void {
    this.ticketsService.getMyTickets().subscribe({
      next: (tickets) => {
        this.misTickets = tickets;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading my tickets:', err)
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success'): void {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, closing: false };
    this.toasts = [...this.toasts, newToast];

    setTimeout(() => {
      this.closeToast(newToast);
    }, 4100);
  }

  closeToast(toast: any): void {
    const exists = this.toasts.find(x => x.id === toast.id);
    if (!exists || exists.closing) return;

    this.toasts = this.toasts.map(t =>
      t.id === toast.id ? { ...t, closing: true } : t
    );

    setTimeout(() => {
      this.toasts = this.toasts.filter(x => x.id !== toast.id);
      this.cdr.detectChanges();
    }, 400);
  }

  // Lógica de Gráficos
  renderCharts(): void {
    if (this.activeSection !== 'dashboard') return;

    // Usamos setTimeout para asegurar que los elementos del DOM (canvas) ya existan
    setTimeout(() => {
      this.renderGrowthChart();
      this.renderCitasChart();
    }, 100);
  }

  renderGrowthChart(): void {
    const canvas = document.getElementById('growthChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.growthChart) {
      this.growthChart.destroy();
    }

    const monthCounts: { [key: string]: { users: number, pets: number } } = {};

    this.usuariosSinCuenta.forEach(u => {
      const date = u.createdAt ? new Date(u.createdAt) : new Date();
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthCounts[month]) monthCounts[month] = { users: 0, pets: 0 };
      monthCounts[month].users++;
    });

    this.mascotas.forEach(p => {
      const date = p.createdAt ? new Date(p.createdAt) : new Date();
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthCounts[month]) monthCounts[month] = { users: 0, pets: 0 };
      monthCounts[month].pets++;
    });

    const sortedMonths = Object.keys(monthCounts).sort();
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const labels = sortedMonths.map(m => {
      const [year, month] = m.split('-');
      return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
    });

    const userData = sortedMonths.map(m => monthCounts[m].users);
    const petData = sortedMonths.map(m => monthCounts[m].pets);

    this.growthChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Usuarios',
            data: userData,
            borderColor: '#1d3976',
            backgroundColor: 'rgba(29, 57, 118, 0.1)',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Mascotas',
            data: petData,
            borderColor: '#66B566',
            backgroundColor: 'rgba(102, 181, 102, 0.1)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  renderCitasChart(): void {
    const canvas = document.getElementById('citasChart') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.citasChart) {
      this.citasChart.destroy();
    }

    const citasPorDia = [0, 0, 0, 0, 0, 0, 0]; // Dom a Sab

    // Obtener inicio y fin de la semana actual (Lunes a Domingo)
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Lunes, ...
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay; // Ajuste para Lunes = primer día
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    this.citas.forEach(cita => {
      if (cita.fechaHora) {
        const citaDate = new Date(cita.fechaHora);
        // Filtrar citas que pertenecen a la semana actual
        if (citaDate >= startOfWeek && citaDate <= endOfWeek) {
          const dayIndex = citaDate.getDay();
          citasPorDia[dayIndex]++;
        }
      }
    });

    // Reordenar para que Lunes sea el primero
    const labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const data = [
      citasPorDia[1], citasPorDia[2], citasPorDia[3], citasPorDia[4], 
      citasPorDia[5], citasPorDia[6], citasPorDia[0]
    ];

    this.citasChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Citas Médicas',
          data: data,
          backgroundColor: '#9BC3E8',
          borderColor: '#1d3976',
          borderWidth: 1,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } }
        }
      }
    });
  }

  getRoleName(): string {
    const roleMap: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Super Administrador',
      3: 'Veterinario',
      4: 'Usuario'
    };
    return roleMap[this.usuario.roleId || 3] || 'Veterinario';
  }

  private getHeaders() {
    const token = localStorage.getItem('access_token');
    console.log('🔑 [Veterinario] Token recuperado:', token ? 'Token presente ✅' : 'Token ausente ❌');
    return {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
  }

  // Lógica de Mascotas
  cargarMascotas(): void {
    this.http.get<any[]>(`${this.API_BASE}/pets/by-veterinaria`, this.getHeaders()).subscribe({
      next: (data) => {
        this.mascotas = data;
        if (this.activeSection === 'dashboard') this.renderCharts();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando mascotas de la veterinaria:', err)
    });
  }

  cargarUsuarios(): void {
    this.userService.getUsersByVeterinaria().subscribe({
      next: (data) => {
        console.log('👥 Clientes de la veterinaria cargados:', data);
        this.usuarios = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando usuarios de la veterinaria:', err)
    });
  }

  cargarUsuariosSinCuenta(): void {
    this.userService.getUsersByVeterinaria().subscribe({
      next: (data) => {
        this.usuariosSinCuenta = data;
        console.log('👥 Usuarios de la veterinaria cargados:', data.length);
        if (this.activeSection === 'dashboard') this.renderCharts();
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando usuarios de la veterinaria:', err)
    });
  }

  openAddUserModal(): void {
    this.showAddUserModal = true;
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.newUser = {
      firstName: '',
      lastName: '',
      documentType: 'Cédula',
      documentNumber: '',
      phone: '',
      address: '',
      age: 18
    };
  }

  registrarUsuario(): void {
    if (!this.newUser.firstName || !this.newUser.lastName || !this.newUser.documentNumber) {
      this.showToast('Por favor complete los campos obligatorios (Nombres, Apellidos y Documento)', 'warning');
      return;
    }

    this.userService.registerUserByVet(this.newUser).subscribe({
      next: (res) => {
        this.showToast('Usuario registrado con éxito', 'success');
        this.cargarUsuarios(); // Para el select de mascotas
        this.cargarUsuariosSinCuenta(); // Para la tabla de usuarios
        this.closeAddUserModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        this.showToast('Error al registrar usuario: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  openEditUserModal(user: any): void {
    this.editingUser = { ...user };
    this.showEditUserModal = true;
  }

  closeEditUserModal(): void {
    this.showEditUserModal = false;
    this.editingUser = {
      firstName: '', lastName: '', documentType: '', 
      documentNumber: '', phone: '', address: '', age: 18
    };
  }

  actualizarUsuario(): void {
    if (!this.editingUser.id) return;
    
    this.http.patch(`${this.API_BASE}/users/${this.editingUser.id}`, this.editingUser, this.getHeaders()).subscribe({
      next: () => {
        this.showToast('Usuario actualizado con éxito', 'success');
        this.cargarUsuarios();
        this.cargarUsuariosSinCuenta();
        this.closeEditUserModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.showToast('Error al actualizar usuario: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  openAddPetModal(): void {
    this.showAddPetModal = true;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  closeAddPetModal(): void {
    this.showAddPetModal = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  registrarMascota(): void {
    if (!this.newPet.ownerId) {
      this.showToast('Por favor seleccione un dueño', 'warning');
      return;
    }

    if (this.newPet.age < 0 || this.newPet.weight < 0) {
      this.showToast('La edad y el peso no pueden ser valores negativos', 'warning');
      return;
    }

    // Usar FormData para permitir subida de imagen
    const formData = new FormData();
    formData.append('name', this.newPet.name);
    formData.append('species', this.newPet.species);
    formData.append('breed', this.newPet.breed || '');
    formData.append('age', String(this.newPet.age));
    formData.append('gender', this.newPet.gender);
    formData.append('color', this.newPet.color);
    formData.append('weight', String(this.newPet.weight));
    formData.append('description', this.newPet.description || '');
    formData.append('ownerId', String(this.newPet.ownerId));

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.http.post(`${this.API_BASE}/pets`, formData, this.getHeaders()).subscribe({
      next: () => {
        this.showToast('Mascota registrada con éxito', 'success');
        this.cargarMascotas();
        this.closeAddPetModal();
        this.newPet = {
          name: '', species: '', breed: '', age: 0, gender: 'Macho', 
          color: '', weight: 0, description: '', ownerId: undefined
        };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al registrar mascota:', err);
        this.showToast('Error al registrar mascota: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  openEditPetModal(pet: any): void {
    this.editingPet = { ...pet };
    this.editingPet.ownerId = pet.owner?.id || pet.ownerId;
    this.showEditPetModal = true;
    this.imagePreview = pet.foto ? `${this.API_BASE}${pet.foto}` : null;
  }

  closeEditPetModal(): void {
    this.showEditPetModal = false;
    this.editingPet = {
      name: '', species: '', breed: '', age: 0, gender: 'M',
      color: '', weight: 0, description: '', ownerId: undefined
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }

  actualizarMascota(): void {
    if (!this.editingPet.id) return;

    const formData = new FormData();
    formData.append('name', this.editingPet.name);
    formData.append('species', this.editingPet.species);
    formData.append('breed', this.editingPet.breed || '');
    formData.append('age', String(this.editingPet.age));
    formData.append('gender', this.editingPet.gender);
    formData.append('color', this.editingPet.color);
    formData.append('weight', String(this.editingPet.weight));
    formData.append('description', this.editingPet.description || '');
    formData.append('ownerId', String(this.editingPet.ownerId));

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.http.patch(`${this.API_BASE}/pets/${this.editingPet.id}`, formData, this.getHeaders()).subscribe({
      next: () => {
        this.showToast('Mascota actualizada con éxito', 'success');
        this.cargarMascotas();
        this.closeEditPetModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar mascota:', err);
        this.showToast('Error al actualizar mascota: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  // Lógica de Citas
  cargarCitas(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.http.get<any[]>(`${this.API_BASE}/citas/veterinario/${currentUser.id}`, this.getHeaders()).subscribe({
      next: (data) => {
        // Ordenar: Programadas arriba, Completadas/Canceladas abajo, luego por fecha ascendente
        this.citas = data.sort((a, b) => {
          const order: { [key: string]: number } = { 'Programada': 0, 'En curso': 1, 'Completada': 2, 'Cancelada': 3 };
          const aOrder = order[a.estado] ?? 99;
          const bOrder = order[b.estado] ?? 99;
          
          if (aOrder !== bOrder) return aOrder - bOrder;
          return new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime();
        });
        this.cdr.detectChanges();
        if (this.activeSection === 'dashboard') this.renderCharts();
      },
      error: (err) => console.error('Error cargando citas:', err)
    });
  }

  finalizarCita(id: number): void {
    Swal.fire({
      title: '¿Finalizar cita?',
      text: '¿Estás seguro de que deseas marcar esta cita como finalizada?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2e7d32',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, finalizar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.patch(`${this.API_BASE}/citas/${id}`, { estado: 'Completada' }, this.getHeaders()).subscribe({
          next: () => {
            this.showToast('Cita finalizada con éxito', 'success');
            this.cargarCitas();
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.showToast('Error al finalizar cita: ' + (err.error?.message || err.message), 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  eliminarCita(id: number): void {
    Swal.fire({
      title: '¿Eliminar cita?',
      text: '¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.API_BASE}/citas/${id}`, this.getHeaders()).subscribe({
          next: () => {
            this.showToast('Cita eliminada con éxito', 'success');
            this.cargarCitas();
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.showToast('Error al eliminar cita: ' + (err.error?.message || err.message), 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  openProgramarCitaModal(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTimeStr = now.toISOString().slice(0, 16);
    this.showAddCitaModal = true;
  }

  registrarCita(): void {
    // 1. Encontrar la mascota seleccionada para obtener su dueño
    const mascotaSeleccionada = this.mascotas.find(m => m.id === this.newCita.petId);
    
    if (!mascotaSeleccionada) {
      this.showToast('Por favor selecciona una mascota', 'warning');
      return;
    }

    if (!this.newCita.fecha || !this.newCita.motivo) {
      this.showToast('Por favor completa la fecha y el motivo', 'warning');
      return;
    }

    // 2. Construir el objeto con los nombres que el backend espera (CreateCitaDto)
    const payload = {
      fechaHora: this.newCita.fecha,
      motivo: this.newCita.motivo,
      usuarioId: mascotaSeleccionada.ownerId || mascotaSeleccionada.owner?.id,
      mascotaId: this.newCita.petId,
      idVeterinario: this.vetUser?.id, // Asignar automáticamente el veterinario logueado
      estado: 'Programada'
    };

    console.log('📤 Enviando cita:', payload);

    this.http.post(`${this.API_BASE}/citas`, payload, this.getHeaders()).subscribe({
      next: () => {
        this.showToast('Cita programada con éxito', 'success');
        this.cargarCitas();
        this.showAddCitaModal = false;
        this.newCita = { fecha: '', motivo: '', userId: null, petId: null };
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error al registrar cita:', err);
        const msg = err.error?.message || 'Error desconocido';
        this.showToast('Error al registrar cita: ' + (Array.isArray(msg) ? msg.join(', ') : msg), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  // Lógica de Publicaciones
  showEditPublicacionModal = false;
  editingPublicacion: any = {};
  publicacionImagePreview: string | null = null;
  selectedPublicacionFile: File | null = null;



  openEditPublicacionModal(pub: any): void {
    this.editingPublicacion = { ...pub };
    this.showEditPublicacionModal = true;
    if (pub.imagen) {
      if (pub.imagen.startsWith('http') || pub.imagen.startsWith('assets/')) {
        this.publicacionImagePreview = pub.imagen;
      } else {
        this.publicacionImagePreview = `${this.API_BASE}${pub.imagen}`;
      }
    } else {
      this.publicacionImagePreview = null;
    }
  }

  closeEditPublicacionModal(): void {
    this.showEditPublicacionModal = false;
    this.editingPublicacion = {};
    this.selectedPublicacionFile = null;
    this.publicacionImagePreview = null;
  }

  onPublicacionFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedPublicacionFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.publicacionImagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarPublicacion(): void {
    if (!this.editingPublicacion.id || !this.editingPublicacion.descripcion) {
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', this.editingPublicacion.descripcion);

    if (this.selectedPublicacionFile) {
      formData.append('imagen', this.selectedPublicacionFile);
    }

    this.http.patch(`${this.API_BASE}/publicaciones/${this.editingPublicacion.id}`, formData, this.getHeaders()).subscribe({
      next: () => {
        this.showToast('Publicación actualizada con éxito', 'success');
        this.cargarPublicacionesUsuario();
        this.closeEditPublicacionModal();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar publicación:', err);
        this.showToast('Error al actualizar publicación: ' + (err.error?.message || err.message), 'error');
        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // ─── HISTORIAS CLÍNICAS ─────────────────────────────────────────

  onOwnerChange(): void {
    this.hcSelectedPetId = null;
    this.hcMascotasFiltradas = this.mascotas.filter(
      (m: any) => m.ownerId === this.hcSelectedOwnerId || m.owner?.id === this.hcSelectedOwnerId
    );
  }

  abrirHistoriaClinica(): void {
    if (!this.hcSelectedPetId) return;
    this.hcLoading = true;
    this.cdr.detectChanges();
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.get<any>(`${this.API_BASE}/historias-clinicas/mascota/${this.hcSelectedPetId}`, { headers })
      .subscribe({
        next: (historia) => {
          this.historiaActual = historia;
          this.consultasActuales = historia.consultas || [];
          this.hcLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error cargando historia:', err);
          this.hcLoading = false;
          this.cdr.detectChanges();
          this.showToast('Error al cargar la historia clínica: ' + (err.error?.message || err.message), 'error');
        }
      });
  }

  cerrarHistoria(): void {
    this.historiaActual = null;
    this.consultasActuales = [];
    this.hcSelectedOwnerId = null;
    this.hcSelectedPetId = null;
    this.hcMascotasFiltradas = [];
    this.hcEditando = false;
  }

  iniciarEdicionHistoria(): void {
    this.hcEditForm = {
      alergias: this.historiaActual.alergias || '',
      antecedentes: this.historiaActual.antecedentes || '',
      vacunas: this.historiaActual.vacunas || '',
      esterilizado: this.historiaActual.esterilizado ?? false,
      observaciones_generales: this.historiaActual.observaciones_generales || ''
    };
    this.hcEditando = true;
  }

  guardarEdicionHistoria(): void {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.patch<any>(`${this.API_BASE}/historias-clinicas/${this.historiaActual.id}`, this.hcEditForm, { headers })
      .subscribe({
        next: (updated) => {
          Object.assign(this.historiaActual, updated);
          this.hcEditando = false;
          this.showToast('Historia clínica actualizada con éxito', 'success');
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.showToast('Error al guardar: ' + (err.error?.message || err.message), 'error');
          this.cdr.detectChanges();
        }
      });
  }

  minDateTimeStr: string = '';
  minDateStr: string = '';

  abrirNuevaConsulta(): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTimeStr = now.toISOString().slice(0, 16);
    this.minDateStr = now.toISOString().split('T')[0];

    this.nuevaConsulta = {
      fechaConsulta: '', peso: null, temperatura: null,
      motivoConsulta: '', sintomas: '', diagnostico: '',
      tratamiento: '', medicamentos: '', observaciones: '', proximaCita: ''
    };
    this.showNuevaConsultaModal = true;
  }

  editarConsulta(consulta: any): void {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.minDateTimeStr = now.toISOString().slice(0, 16);
    this.minDateStr = now.toISOString().split('T')[0];

    this.nuevaConsulta = { ...consulta };
    if (this.nuevaConsulta.fechaConsulta) {
      this.nuevaConsulta.fechaConsulta = new Date(this.nuevaConsulta.fechaConsulta).toISOString().slice(0, 16);
    }
    if (this.nuevaConsulta.proximaCita) {
      this.nuevaConsulta.proximaCita = new Date(this.nuevaConsulta.proximaCita).toISOString().split('T')[0];
    }
    this.showNuevaConsultaModal = true;
  }

  guardarNuevaConsulta(): void {
    if (!this.historiaActual) return;
    
    // Validación de fecha para consultas (solo para nuevas consultas)
    if (!this.nuevaConsulta.id && this.nuevaConsulta.fechaConsulta) {
      const now = new Date().getTime();
      const selectedDate = new Date(this.nuevaConsulta.fechaConsulta).getTime();
      if (selectedDate < now - 60000) { // Margen de 1 minuto
        this.showToast('La fecha y hora de la consulta no puede ser en el pasado.', 'warning');
        return;
      }
    }

    if (this.nuevaConsulta.proximaCita) {
      // Para fecha sin hora, comparamos con el inicio del día de hoy
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Parsear la fecha seleccionada (viene en formato YYYY-MM-DD)
      const [year, month, day] = this.nuevaConsulta.proximaCita.split('-');
      const selectedNextDate = new Date(Number(year), Number(month) - 1, Number(day));
      
      if (selectedNextDate.getTime() < today.getTime()) {
        this.showToast('La fecha de la próxima cita no puede ser en el pasado.', 'warning');
        return;
      }
    }

    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };
    const payload = {
      ...this.nuevaConsulta,
      historiaId: this.historiaActual.id,
      peso: this.nuevaConsulta.peso ? Number(this.nuevaConsulta.peso) : undefined,
      temperatura: this.nuevaConsulta.temperatura ? Number(this.nuevaConsulta.temperatura) : undefined,
      fechaConsulta: this.nuevaConsulta.fechaConsulta || undefined,
      proximaCita: this.nuevaConsulta.proximaCita || undefined
    };

    if (this.nuevaConsulta.id) {
      this.http.patch<any>(`${this.API_BASE}/historias-clinicas/consultas/${this.nuevaConsulta.id}`, payload, { headers })
        .subscribe({
          next: (consulta) => {
            const index = this.consultasActuales.findIndex(c => c.id === consulta.id);
            if (index !== -1) {
              this.consultasActuales[index] = consulta;
            }
            if (this.nuevaConsulta.peso) {
              this.actualizarPesoMascota(this.historiaActual.mascotaId, this.nuevaConsulta.peso);
            }
            this.showToast('Consulta actualizada con éxito', 'success');
            this.showNuevaConsultaModal = false;
            this.cdr.detectChanges();
          },
          error: (err) => this.showToast('Error al actualizar consulta: ' + (err.error?.message || err.message), 'error')
        });
    } else {
      this.http.post<any>(`${this.API_BASE}/historias-clinicas/consultas`, payload, { headers })
        .subscribe({
          next: (consulta) => {
            this.consultasActuales.unshift(consulta);
            if (this.nuevaConsulta.peso) {
              this.actualizarPesoMascota(this.historiaActual.mascotaId, this.nuevaConsulta.peso);
            }
            this.showToast('Consulta creada con éxito', 'success');
            this.showNuevaConsultaModal = false;
            this.cdr.detectChanges();
          },
          error: (err) => this.showToast('Error al crear consulta: ' + (err.error?.message || err.message), 'error')
        });
    }
  }

  private actualizarPesoMascota(mascotaId: number, peso: number): void {
    const token = localStorage.getItem('access_token');
    const headers = { Authorization: `Bearer ${token}` };
    this.http.patch(`${this.API_BASE}/pets/${mascotaId}`, { weight: Number(peso) }, { headers })
      .subscribe({
        next: () => {
          console.log('⚖️ [Historia Clínica] Peso de la mascota actualizado en la tabla pets.');
          this.cargarMascotas();
        },
        error: (err) => console.error('Error al actualizar peso de la mascota:', err)
      });
  }
  // ────────────────────────────────────────────────────────────────
  // ===== TICKETS =====
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
      this.showToast('Por favor, completa los campos obligatorios', 'warning');
      this.cdr.detectChanges();
      return;
    }

    if (this.newTicket.asunto.length < 5) {
      this.showToast('El asunto debe tener al menos 5 caracteres', 'warning');
      this.cdr.detectChanges();
      return;
    }

    if (this.newTicket.descripcion.length < 10) {
      this.showToast('La descripción debe tener al menos 10 caracteres', 'warning');
      this.cdr.detectChanges();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.showToast('Debes estar logueado para crear un ticket', 'warning');
      this.cdr.detectChanges();
      return;
    }

    this.ticketsService.create(this.newTicket).subscribe({
      next: () => {
        this.closeTicketModal();
        this.loadMyTickets();
        this.showToast('Ticket creado correctamente. Te responderemos pronto.', 'success');
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error creating ticket:', err);
        this.showToast('Error al crear ticket. Por favor intenta nuevamente.', 'error');
        this.cdr.detectChanges();
      }
    });
  }
}  // ────────────────────────────────────────────────────────────────
