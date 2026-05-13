import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { ThemeService } from '../../../core/services/theme.service';
import { PublicacionesService } from '../../inicio/services/publicaciones.service';

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
  fecha: string;
  motivo: string;
  estado: string;
  userId: number;
  petId: number;
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

@Component({
  selector: 'app-veterinario',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

  activeSection: string = 'dashboard';
  sidebarOpen: boolean = true;
  darkMode: boolean = false;
  today: Date = new Date();

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

  // Modales y Formularios
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
  selectedFile: File | null = null;
  imagePreview: string | null = null;

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
        },
        error: (err) => console.error('Error al cargar publicaciones:', err)
      });
    }
  }

  eliminarPublicacion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      this.publicacionesService.eliminarPublicacion(id).subscribe({
        next: () => {
          this.cargarPublicacionesUsuario();
          alert('Publicación eliminada exitosamente');
        },
        error: (err) => alert('Error al eliminar publicación: ' + (err.error?.message || err.message))
      });
    }
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
        alert('Perfil actualizado correctamente');
      },
      error: (error) => alert('Error al actualizar el perfil: ' + (error.error?.message || error.message))
    });
  }

  eliminarCuenta(): void {
    if (this.vetUser && confirm('¿Estás seguro de que deseas desactivar tu cuenta?')) {
      this.userService.deleteUser(this.vetUser.id).subscribe({
        next: () => {
          alert('Cuenta desactivada exitosamente.');
          this.cerrarSesion();
        },
        error: (error) => alert('Error al eliminar la cuenta: ' + (error.error?.message || error.message))
      });
    }
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
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
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
      next: (data) => this.mascotas = data,
      error: (err) => console.error('Error cargando mascotas de la veterinaria:', err)
    });
  }

  cargarUsuarios(): void {
    this.userService.getUsersByVeterinaria().subscribe({
      next: (data) => {
        console.log('👥 Clientes de la veterinaria cargados:', data);
        this.usuarios = data;
      },
      error: (err) => console.error('Error cargando usuarios de la veterinaria:', err)
    });
  }

  cargarUsuariosSinCuenta(): void {
    this.userService.getUsersByVeterinaria().subscribe({
      next: (data) => {
        this.usuariosSinCuenta = data;
        console.log('👥 Usuarios de la veterinaria cargados:', data.length);
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
      alert('Por favor complete los campos obligatorios (Nombres, Apellidos y Documento)');
      return;
    }

    this.userService.registerUserByVet(this.newUser).subscribe({
      next: (res) => {
        alert('Usuario registrado con éxito');
        this.cargarUsuarios(); // Para el select de mascotas
        this.cargarUsuariosSinCuenta(); // Para la tabla de usuarios
        this.closeAddUserModal();
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        alert('Error al registrar usuario: ' + (err.error?.message || err.message));
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
        alert('Usuario actualizado con éxito');
        this.cargarUsuariosSinCuenta();
        this.closeEditUserModal();
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        alert('Error al actualizar usuario: ' + (err.error?.message || err.message));
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
      alert('Por favor seleccione un dueño');
      return;
    }

    if (this.newPet.age < 0 || this.newPet.weight < 0) {
      alert('La edad y el peso no pueden ser valores negativos');
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
        alert('Mascota registrada con éxito');
        this.cargarMascotas();
        this.closeAddPetModal();
        this.newPet = {
          name: '', species: '', breed: '', age: 0, gender: 'Macho', 
          color: '', weight: 0, description: '', ownerId: undefined
        };
      },
      error: (err) => {
        console.error('Error al registrar mascota:', err);
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
        alert('Mascota actualizada con éxito');
        this.cargarMascotas();
        this.closeEditPetModal();
      },
      error: (err) => {
        console.error('Error al actualizar mascota:', err);
        alert('Error al actualizar mascota: ' + (err.error?.message || err.message));
      }
    });
  }

  // Lógica de Citas
  cargarCitas(): void {
    this.http.get<any[]>(`${this.API_BASE}/citas`, this.getHeaders()).subscribe({
      next: (data) => this.citas = data,
      error: (err) => console.error('Error cargando citas:', err)
    });
  }

  registrarCita(): void {
    // 1. Encontrar la mascota seleccionada para obtener su dueño
    const mascotaSeleccionada = this.mascotas.find(m => m.id === this.newCita.petId);
    
    if (!mascotaSeleccionada) {
      alert('Por favor selecciona una mascota');
      return;
    }

    if (!this.newCita.fecha || !this.newCita.motivo) {
      alert('Por favor completa la fecha y el motivo');
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
        alert('✅ Cita programada con éxito');
        this.cargarCitas();
        this.showAddCitaModal = false;
        this.newCita = { fecha: '', motivo: '', userId: null, petId: null };
      },
      error: (err) => {
        console.error('❌ Error al registrar cita:', err);
        const msg = err.error?.message || 'Error desconocido';
        alert('❌ Error al registrar cita: ' + (Array.isArray(msg) ? msg.join(', ') : msg));
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
      alert('Por favor complete los campos obligatorios (Descripción).');
      return;
    }

    const formData = new FormData();
    formData.append('descripcion', this.editingPublicacion.descripcion);

    if (this.selectedPublicacionFile) {
      formData.append('imagen', this.selectedPublicacionFile);
    }

    this.http.patch(`${this.API_BASE}/publicaciones/${this.editingPublicacion.id}`, formData, this.getHeaders()).subscribe({
      next: () => {
        alert('Publicación actualizada con éxito');
        this.cargarPublicacionesUsuario();
        this.closeEditPublicacionModal();
      },
      error: (err) => {
        console.error('Error al actualizar publicación:', err);
        alert('Error al actualizar publicación: ' + (err.error?.message || err.message));
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
          alert('Error al cargar la historia clínica: ' + (err.error?.message || err.message));
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
        },
        error: (err) => alert('Error al guardar: ' + (err.error?.message || err.message))
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
    
    // Validación de fecha para consultas
    const now = new Date().getTime();
    
    if (this.nuevaConsulta.fechaConsulta) {
      const selectedDate = new Date(this.nuevaConsulta.fechaConsulta).getTime();
      if (selectedDate < now - 60000) { // Margen de 1 minuto
        alert('La fecha y hora de la consulta no puede ser en el pasado.');
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
        alert('La fecha de la próxima cita no puede ser en el pasado.');
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
            this.showNuevaConsultaModal = false;
            this.cdr.detectChanges();
          },
          error: (err) => alert('Error al actualizar consulta: ' + (err.error?.message || err.message))
        });
    } else {
      this.http.post<any>(`${this.API_BASE}/historias-clinicas/consultas`, payload, { headers })
        .subscribe({
          next: (consulta) => {
            this.consultasActuales.unshift(consulta);
            this.showNuevaConsultaModal = false;
            this.cdr.detectChanges();
          },
          error: (err) => alert('Error al guardar consulta: ' + (err.error?.message || err.message))
        });
    }
  }
  // ────────────────────────────────────────────────────────────────
}
