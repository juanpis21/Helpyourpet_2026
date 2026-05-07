import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';

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

  // Modales y Formularios
  showAddPetModal: boolean = false;
  showAddUserModal: boolean = false;
  showAddCitaModal: boolean = false;
  
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
    this.cargarDatos();
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
    this.darkMode = !this.darkMode;
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
        alert('Error al registrar mascota: ' + (err.error?.message || err.message));
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
