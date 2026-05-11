import { Component, OnInit, inject } from '@angular/core';
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
    this.cargarPublicaciones();
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
    this.http.get<any[]>(`${this.API_BASE}/pets`, this.getHeaders()).subscribe({
      next: (data) => this.mascotas = data,
      error: (err) => console.error('Error cargando mascotas:', err)
    });
  }

  cargarUsuarios(): void {
    this.userService.getUsersByRoles(['usuario']).subscribe({
      next: (data) => {
        console.log('👥 Clientes cargados:', data);
        this.usuarios = data;
      },
      error: (err) => console.error('Error cargando usuarios:', err)
    });
  }

  cargarUsuariosSinCuenta(): void {
    this.userService.getUsuariosSinCuenta().subscribe({
      next: (data) => {
        this.usuariosSinCuenta = data;
        console.log('👥 Usuarios sin cuenta cargados:', data.length);
      },
      error: (err) => console.error('Error cargando usuarios sin cuenta:', err)
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
  cargarPublicaciones(): void {
    this.http.get<any[]>(`${this.API_BASE}/publicaciones`, this.getHeaders()).subscribe({
      next: (data) => this.publicaciones = data,
      error: (err) => console.error('Error cargando publicaciones:', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
