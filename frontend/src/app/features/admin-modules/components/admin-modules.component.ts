import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { UsersService } from '../../../core/services/users.service';
import { ServiciosService, Servicio } from '../../../core/services/servicios.service';
import { VeterinariasService, Veterinaria } from '../../../core/services/veterinarias.service';
import { ProductosService, Producto } from '../../../core/services/productos.service';
import { CategoriasService, Categoria } from '../../../core/services/categorias.service';
import { RolesService, Role } from '../../../core/services/roles.service';
import { ThemeService } from '../../../core/services/theme.service';
import { TicketsService } from '../../../core/services/tickets.service';
import type { CreateTicketDto } from '../../../core/services/tickets.service';

@Component({
  selector: 'app-admin-modules',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-modules.component.html',
  styleUrl: './admin-modules.component.scss'
})
export class AdminModulesComponent implements OnInit {
  activeSection: string = 'dashboard';
  sidebarOpen: boolean = true;
  darkMode: boolean = false;
  usuarios: any[] = [];
  servicios: Servicio[] = [];
  veterinarias: Veterinaria[] = [];
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  roles: Role[] = [];
  veterinarios: any[] = [];
  isLoading: boolean = false;
  
  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
  
  // Variables de Búsqueda
  searchTermUsuarios: string = '';
  searchTermVeterinarias: string = '';
  searchTermProductos: string = '';
  searchTermVeterinarios: string = '';
  searchTermServicios: string = '';

  // Variables de Paginación
  itemsPerPage: number = 10;
  currentPageUsuarios: number = 1;
  currentPageVeterinarias: number = 1;
  currentPageProductos: number = 1;
  currentPageVeterinarios: number = 1;
  currentPageServicios: number = 1;


  // Configuración Admin
  adminUser: any = {
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    edad: 0,
    direccion: '',
    tipoDocumento: '',
    numDocumento: '',
    imagen: ''
  };
  adminProfilePreview: string | null = null;
  selectedAdminFile: File | null = null;
  newPassword: string = '';

  // Ticket modal
  showTicketModal: boolean = false;
  misTickets: any[] = [];
  newTicket: CreateTicketDto = {
    asunto: '',
    descripcion: '',
    prioridad: 'Media'
  };

  // Modales Usuarios
  showAddUserModal: boolean = false;
  showEditUserModal: boolean = false;

  newUser: any = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    roleId: null
  };

  editingUser: any = {};

  // Modales
  showAddServiceModal: boolean = false;
  showEditServiceModal: boolean = false;

  // Modales Veterinarias
  showAddVeterinariaModal: boolean = false;
  showEditVeterinariaModal: boolean = false;

  // Modales Productos
  showAddProductoModal: boolean = false;
  showEditProductoModal: boolean = false;

  // Modales Categorías
  showAddCategoriaModal: boolean = false;
  showEditCategoriaModal: boolean = false;

  // Modales Veterinarios
  showAddVeterinarioModal: boolean = false;
  showEditVeterinarioModal: boolean = false;

  newCategoria: Partial<Categoria> = {
    nombre: '',
    descripcion: '',
    codigo: '',
    color: '#4ade80',
    isActive: true
  };

  editingCategoria: Partial<Categoria> = {};

  newService: Partial<Servicio> = {
    nombre: '',
    tipoServicio: '',
    precioBase: 0,
    duracionMinutos: 30,
    requiereCita: true,
    descripcion: '',
    veterinariaId: 0
  };

  editingService: Partial<Servicio> = {};

  newVeterinaria: Partial<Veterinaria> = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    rut: '',
    descripcion: '',
    isActive: true
  };

  editingVeterinaria: Partial<Veterinaria> = {};

  newProducto: Partial<Producto> = {
    nombre: '',
    descripcion: '',
    codigoBarras: '',
    stockActual: 0,
    stockMinimo: 5,
    precioCompra: 0,
    precioVenta: 0,
    unidadMedida: 'unidades',
    categoriaId: 0,
    veterinariaId: 0,
    isActive: true
  };

  editingProducto: Partial<Producto> = {};

  // Datos Veterinarios
  newVeterinario: any = {
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    address: '',
    especialidad: '',
    matricula: '',
    aniosExperiencia: 0,
    universidad: '',
    telefonoProfesional: '',
    emailProfesional: '',
    biografia: '',
    veterinariaPrincipalId: 0,
    roleId: 0
  };

  editingVeterinario: any = {};
  editingUsuario: any = {};

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  
  // Imagenes para Productos
  selectedProductoFile: File | null = null;
  productoImagePreview: string | null = null;

  baseUrl: string = 'http://localhost:3000';

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

  // Método para obtener headers con autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private serviciosService: ServiciosService,
    private veterinariasService: VeterinariasService,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private rolesService: RolesService,
    private themeService: ThemeService,
    private router: Router,
    private http: HttpClient,
    private ticketsService: TicketsService
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarServicios();
    this.cargarVeterinarias();
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarRoles();
    this.cargarVeterinarios();
    this.darkMode = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.darkMode = dark);
    this.loadAdminProfile();
    this.loadMyTickets();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  setSection(section: string): void {
    this.activeSection = section;
    if (section === 'tickets') {
      this.loadMyTickets();
    }
    if (section === 'veterinarios') {
      this.cargarVeterinarios();
    }
  }

  loadMyTickets(): void {
    this.ticketsService.getMyTickets().subscribe({
      next: (tickets) => this.misTickets = tickets,
      error: (err) => console.error('Error loading my tickets:', err)
    });
  }

  cargarUsuarios(): void {
    this.usersService.getUsersByRoles(['usuario']).subscribe({
      next: (data) => this.usuarios = data,
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  cargarRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error al cargar roles:', err)
    });
  }

  cargarServicios(): void {
    this.isLoading = true;
    this.serviciosService.getAll().subscribe({
      next: (data) => {
        this.servicios = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar servicios:', err);
        this.isLoading = false;
      }
    });
  }



  get filteredUsuarios(): any[] {
    if (!this.usuarios) return [];
    
    return this.usuarios.filter(u => {
      const roleStr = this.getRolesString(u).toLowerCase().trim();
      // Solo incluimos si el rol es exactamente 'usuario'
      return roleStr === 'usuario';
    });
  }

  getRolesString(user: any): string {
    if (!user.role) return 'Usuario';
    if (typeof user.role === 'string') return user.role;
    return user.role.name || 'Usuario';
  }

  // Getters para listas filtradas con búsqueda
  get filteredUsuariosList(): any[] {
    const baseList = this.usuarios.filter(u => this.getRolesString(u).toLowerCase() === 'usuario');
    if (!this.searchTermUsuarios) return baseList;
    const term = this.searchTermUsuarios.toLowerCase();
    return baseList.filter(u => 
      (u.firstName || '').toLowerCase().includes(term) ||
      (u.lastName || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term)
    );
  }

  get filteredVeterinariasList(): Veterinaria[] {
    if (!this.searchTermVeterinarias) return this.veterinarias;
    const term = this.searchTermVeterinarias.toLowerCase();
    return this.veterinarias.filter(v => 
      (v.nombre || '').toLowerCase().includes(term) ||
      (v.email || '').toLowerCase().includes(term) ||
      (v.rut || '').toLowerCase().includes(term)
    );
  }

  get filteredProductosList(): Producto[] {
    if (!this.searchTermProductos) return this.productos;
    const term = this.searchTermProductos.toLowerCase();
    return this.productos.filter(p => 
      (p.nombre || '').toLowerCase().includes(term) ||
      (p.codigoBarras || '').toLowerCase().includes(term) ||
      (p.lote || '').toLowerCase().includes(term) ||
      this.getCategoriaNombre(p.categoriaId).toLowerCase().includes(term)
    );
  }

  get filteredVeterinariosList(): any[] {
    if (!this.searchTermVeterinarios) return this.veterinarios;
    const term = this.searchTermVeterinarios.toLowerCase();
    return this.veterinarios.filter(v => 
      (v.firstName || '').toLowerCase().includes(term) ||
      (v.lastName || '').toLowerCase().includes(term) ||
      (v.username || '').toLowerCase().includes(term) ||
      (v.perfilVeterinario?.especialidad || '').toLowerCase().includes(term) ||
      (v.perfilVeterinario?.matricula || '').toLowerCase().includes(term)
    );
  }

  get filteredServiciosList(): Servicio[] {
    if (!this.searchTermServicios) return this.servicios;
    const term = this.searchTermServicios.toLowerCase();
    return this.servicios.filter(s => 
      (s.nombre || '').toLowerCase().includes(term) ||
      (s.tipoServicio || '').toLowerCase().includes(term) ||
      (s.descripcion || '').toLowerCase().includes(term)
    );
  }

  // Getters para listas paginadas
  get paginatedUsuariosList(): any[] {
    const start = (this.currentPageUsuarios - 1) * this.itemsPerPage;
    return this.filteredUsuariosList.slice(start, start + this.itemsPerPage);
  }

  get paginatedVeterinariasList(): Veterinaria[] {
    const start = (this.currentPageVeterinarias - 1) * this.itemsPerPage;
    return this.filteredVeterinariasList.slice(start, start + this.itemsPerPage);
  }

  get paginatedProductosList(): Producto[] {
    const start = (this.currentPageProductos - 1) * this.itemsPerPage;
    return this.filteredProductosList.slice(start, start + this.itemsPerPage);
  }

  get paginatedVeterinariosList(): any[] {
    const start = (this.currentPageVeterinarios - 1) * this.itemsPerPage;
    return this.filteredVeterinariosList.slice(start, start + this.itemsPerPage);
  }

  get paginatedServiciosList(): Servicio[] {
    const start = (this.currentPageServicios - 1) * this.itemsPerPage;
    return this.filteredServiciosList.slice(start, start + this.itemsPerPage);
  }

  // Métodos de navegación
  getMath(): any { return Math; }

  getTotalPages(list: any[]): number {
    return Math.ceil(list.length / this.itemsPerPage);
  }

  nextPage(type: string, list: any[]): void {
    const total = this.getTotalPages(list);
    if (type === 'usuarios' && this.currentPageUsuarios < total) this.currentPageUsuarios++;
    if (type === 'veterinarias' && this.currentPageVeterinarias < total) this.currentPageVeterinarias++;
    if (type === 'productos' && this.currentPageProductos < total) this.currentPageProductos++;
    if (type === 'veterinarios' && this.currentPageVeterinarios < total) this.currentPageVeterinarios++;
    if (type === 'servicios' && this.currentPageServicios < total) this.currentPageServicios++;
  }

  prevPage(type: string): void {
    if (type === 'usuarios' && this.currentPageUsuarios > 1) this.currentPageUsuarios--;
    if (type === 'veterinarias' && this.currentPageVeterinarias > 1) this.currentPageVeterinarias--;
    if (type === 'productos' && this.currentPageProductos > 1) this.currentPageProductos--;
    if (type === 'veterinarios' && this.currentPageVeterinarios > 1) this.currentPageVeterinarios--;
    if (type === 'servicios' && this.currentPageServicios > 1) this.currentPageServicios--;
  }

  // CRUD USUARIOS
  openAddUserModal(): void {
    console.log('Abriendo modal de agregar usuario');
    this.showAddUserModal = true;
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.newUser = { username: '', email: '', password: '', firstName: '', lastName: '', roleId: null };
  }

  guardarUsuario(): void {
    if (!this.newUser.username || !this.newUser.email || !this.newUser.password) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    this.usersService.createUser(this.newUser).subscribe({
      next: () => {
        this.closeAddUserModal();
        this.cargarUsuarios();
        alert('Usuario creado correctamente');
      },
      error: (err) => alert('Error al crear usuario: ' + (err.error?.message || err.message))
    });
  }

  openEditUserModal(user: any): void {
    this.editingUser = { ...user };
    if (user.role) {
      this.editingUser.roleId = user.role.id || user.roleId;
    }
    this.showEditUserModal = true;
  }

  closeEditUserModal(): void {
    this.showEditUserModal = false;
    this.editingUser = {};
  }

  guardarEdicionUsuario(): void {
    if (!this.editingUser.id) return;

    // Limpiar objeto para el backend
    const { id, password, role, pets, createdAt, updatedAt, fullName, ...updateData } = this.editingUser;
    
    // Si la contraseña está vacía, no la enviamos
    if (!this.editingUser.password) {
      delete updateData.password;
    }

    this.usersService.updateUser(this.editingUser.id, updateData).subscribe({
      next: () => {
        this.closeEditUserModal();
        this.cargarUsuarios();
        alert('Usuario actualizado correctamente');
      },
      error: (err) => alert('Error al actualizar usuario: ' + (err.error?.message || err.message))
    });
  }

  toggleEstadoUsuario(user: any): void {
    const nuevoEstado = !user.isActive;
    this.usersService.updateUser(user.id, { isActive: nuevoEstado }).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => alert('Error al cambiar estado: ' + (err.error?.message || err.message))
    });
  }

  // CRUD SERVICIOS
  openAddServiceModal(): void {
    this.showAddServiceModal = true;
  }

  closeAddServiceModal(): void {
    this.showAddServiceModal = false;
    this.newService = {
      nombre: '',
      tipoServicio: '',
      precioBase: 0,
      duracionMinutos: 30,
      requiereCita: true,
      descripcion: '',
      veterinariaId: 0
    };
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => this.imagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  onProductoFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedProductoFile = file;
      const reader = new FileReader();
      reader.onload = () => this.productoImagePreview = reader.result as string;
      reader.readAsDataURL(file);
    }
  }

  guardarServicio(): void {
    if (!this.newService.nombre || !this.newService.tipoServicio || this.newService.precioBase === undefined || !this.newService.veterinariaId) {
      alert('Por favor, completa los campos obligatorios y selecciona una veterinaria');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.newService.nombre || '');
    formData.append('tipoServicio', this.newService.tipoServicio || '');
    formData.append('precioBase', String(this.newService.precioBase || 0));
    formData.append('duracionMinutos', String(this.newService.duracionMinutos || 30));
    formData.append('descripcion', this.newService.descripcion || '');
    formData.append('veterinariaId', String(this.newService.veterinariaId || 1));
    formData.append('requiereCita', String(this.newService.requiereCita || true));
    
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.serviciosService.create(formData).subscribe({
      next: () => {
        this.closeAddServiceModal();
        this.cargarServicios();
        alert('Servicio creado correctamente');
      },
      error: (err) => alert('Error al crear servicio: ' + err.message)
    });
  }

  openEditServiceModal(servicio: Servicio): void {
    this.editingService = { ...servicio };
    this.showEditServiceModal = true;
  }

  closeEditServiceModal(): void {
    this.showEditServiceModal = false;
    this.editingService = {};
    this.selectedFile = null;
    this.imagePreview = null;
  }

  guardarEdicionServicio(): void {
    if (!this.editingService.id) return;

    const formData = new FormData();
    formData.append('nombre', this.editingService.nombre || '');
    formData.append('descripcion', this.editingService.descripcion || '');
    formData.append('precioBase', String(this.editingService.precioBase || 0));
    formData.append('duracionMinutos', String(this.editingService.duracionMinutos || 30));
    formData.append('tipoServicio', this.editingService.tipoServicio || '');
    formData.append('requiereCita', String(this.editingService.requiereCita || true));
    formData.append('isActive', String(this.editingService.isActive || true));
    formData.append('veterinariaId', String(this.editingService.veterinariaId || 1));

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.serviciosService.update(this.editingService.id, formData).subscribe({
      next: () => {
        this.closeEditServiceModal();
        this.cargarServicios();
        alert('Servicio actualizado correctamente');
      },
      error: (err) => alert('Error al actualizar servicio: ' + err.message)
    });
  }


  toggleEstadoServicio(servicio: Servicio): void {
    const nuevoEstado = !servicio.isActive;
    this.serviciosService.update(servicio.id, { isActive: nuevoEstado }).subscribe({
      next: () => this.cargarServicios(),
      error: (err) => alert('Error al cambiar estado: ' + err.message)
    });
  }

  // ========== CRUD VETERINARIAS ==========
  cargarVeterinarias(): void {
    this.veterinariasService.getAll().subscribe({
      next: (data) => this.veterinarias = data,
      error: (err) => console.error('Error al cargar veterinarias:', err)
    });
  }

  openAddVeterinariaModal(): void {
    this.showAddVeterinariaModal = true;
  }

  closeAddVeterinariaModal(): void {
    this.showAddVeterinariaModal = false;
    this.newVeterinaria = {
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      rut: '',
      descripcion: '',
      isActive: true
    };
  }

  guardarVeterinaria(): void {
    if (!this.newVeterinaria.nombre || !this.newVeterinaria.direccion || !this.newVeterinaria.telefono || !this.newVeterinaria.email || !this.newVeterinaria.rut) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    this.veterinariasService.create(this.newVeterinaria).subscribe({
      next: () => {
        this.closeAddVeterinariaModal();
        this.cargarVeterinarias();
        alert('Veterinaria registrada correctamente');
      },
      error: (err) => alert('Error al registrar veterinaria: ' + (err.error?.message || err.message))
    });
  }

  openEditVeterinariaModal(vet: Veterinaria): void {
    this.editingVeterinaria = { ...vet };
    this.showEditVeterinariaModal = true;
  }

  closeEditVeterinariaModal(): void {
    this.showEditVeterinariaModal = false;
    this.editingVeterinaria = {};
  }

  guardarEdicionVeterinaria(): void {
    if (!this.editingVeterinaria.id) return;

    const { id, createdAt, updatedAt, ...updateData } = this.editingVeterinaria as any;

    this.veterinariasService.update(this.editingVeterinaria.id, updateData).subscribe({
      next: () => {
        this.closeEditVeterinariaModal();
        this.cargarVeterinarias();
        alert('Veterinaria actualizada correctamente');
      },
      error: (err) => alert('Error al actualizar veterinaria: ' + (err.error?.message || err.message))
    });
  }

  toggleEstadoVeterinaria(vet: Veterinaria): void {
    const nuevoEstado = !vet.isActive;
    this.veterinariasService.update(vet.id, { isActive: nuevoEstado }).subscribe({
      next: () => this.cargarVeterinarias(),
      error: (err) => alert('Error al cambiar estado: ' + (err.error?.message || err.message))
    });
  }

  eliminarVeterinaria(vet: Veterinaria): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la veterinaria "${vet.nombre}"?`)) {
      this.veterinariasService.delete(vet.id).subscribe({
        next: () => {
          this.cargarVeterinarias();
          alert('Veterinaria eliminada correctamente');
        },
        error: (err) => alert('Error al eliminar veterinaria: ' + (err.error?.message || err.message))
      });
    }
  }

  // ========== CRUD PRODUCTOS ==========
  cargarProductos(): void {
    this.productosService.getAll().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  cargarCategorias(): void {
    this.categoriasService.getAll().subscribe({
      next: (data) => this.categorias = data,
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  openAddProductoModal(): void {
    this.showAddProductoModal = true;
  }

  closeAddProductoModal(): void {
    this.showAddProductoModal = false;
    this.newProducto = {
      nombre: '',
      descripcion: '',
      codigoBarras: '',
      stockActual: 0,
      stockMinimo: 5,
      precioCompra: 0,
      precioVenta: 0,
      unidadMedida: 'unidades',
      categoriaId: 0,
      veterinariaId: 0,
      isActive: true
    };
    this.selectedProductoFile = null;
    this.productoImagePreview = null;
  }

  guardarProducto(): void {
    if (!this.newProducto.nombre || !this.newProducto.descripcion || !this.newProducto.categoriaId || !this.newProducto.veterinariaId) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    // Usar FormData para permitir subida de imagen
    const formData = new FormData();
    formData.append('nombre', this.newProducto.nombre || '');
    formData.append('descripcion', this.newProducto.descripcion || '');
    formData.append('categoriaId', String(this.newProducto.categoriaId));
    formData.append('veterinariaId', String(this.newProducto.veterinariaId));
    formData.append('stockActual', String(this.newProducto.stockActual || 0));
    formData.append('stockMinimo', String(this.newProducto.stockMinimo || 0));
    formData.append('precioCompra', String(this.newProducto.precioCompra || 0));
    formData.append('precioVenta', String(this.newProducto.precioVenta || 0));
    formData.append('unidadMedida', this.newProducto.unidadMedida || 'unidades');
    formData.append('isActive', String(this.newProducto.isActive ?? true));

    if (this.newProducto.codigoBarras) formData.append('codigoBarras', this.newProducto.codigoBarras);
    if (this.newProducto.lote) formData.append('lote', this.newProducto.lote);
    if (this.newProducto.ubicacion) formData.append('ubicacion', this.newProducto.ubicacion);
    if (this.newProducto.fechaVencimiento) formData.append('fechaVencimiento', this.newProducto.fechaVencimiento);

    if (this.selectedProductoFile) {
      formData.append('imagen', this.selectedProductoFile);
    }

    this.productosService.create(formData).subscribe({
      next: () => {
        this.closeAddProductoModal();
        this.cargarProductos();
        alert('Producto registrado correctamente');
      },
      error: (err) => {
        console.error('Error al registrar producto:', err);
        const errorMsg = err.error?.message;
        const detail = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
        alert('Error al registrar producto: ' + (detail || err.message));
      }
    });
  }

  openEditProductoModal(prod: Producto): void {
    this.editingProducto = { ...prod };
    this.showEditProductoModal = true;
  }

  closeEditProductoModal(): void {
    this.showEditProductoModal = false;
    this.editingProducto = {};
    this.selectedProductoFile = null;
    this.productoImagePreview = null;
  }

  guardarEdicionProducto(): void {
    if (!this.editingProducto.id) return;

    // Usar FormData
    const formData = new FormData();
    const raw = this.editingProducto as any;
    
    formData.append('nombre', raw.nombre);
    formData.append('descripcion', raw.descripcion);
    formData.append('categoriaId', String(raw.categoriaId));
    formData.append('veterinariaId', String(raw.veterinariaId));
    formData.append('stockActual', String(raw.stockActual));
    formData.append('stockMinimo', String(raw.stockMinimo));
    formData.append('precioCompra', String(raw.precioCompra));
    formData.append('precioVenta', String(raw.precioVenta));
    formData.append('unidadMedida', raw.unidadMedida);
    formData.append('isActive', String(raw.isActive));

    if (raw.codigoBarras) formData.append('codigoBarras', raw.codigoBarras);
    if (raw.lote) formData.append('lote', raw.lote);
    if (raw.ubicacion) formData.append('ubicacion', raw.ubicacion);
    if (raw.fechaVencimiento) formData.append('fechaVencimiento', raw.fechaVencimiento);

    if (this.selectedProductoFile) {
      formData.append('imagen', this.selectedProductoFile);
    }

    this.productosService.update(this.editingProducto.id, formData).subscribe({
      next: () => {
        this.closeEditProductoModal();
        this.cargarProductos();
        alert('Producto actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar producto:', err);
        const errorMsg = err.error?.message;
        const detail = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
        alert('Error al actualizar producto: ' + (detail || err.message));
      }
    });
  }

  toggleEstadoProducto(prod: Producto): void {
    const nuevoEstado = !prod.isActive;
    this.productosService.update(prod.id, { isActive: nuevoEstado }).subscribe({
      next: () => this.cargarProductos(),
      error: (err) => alert('Error al cambiar estado: ' + (err.error?.message || err.message))
    });
  }

  eliminarProducto(prod: Producto): void {
    if (confirm(`¿Estás seguro de que quieres eliminar el producto "${prod.nombre}"?`)) {
      this.productosService.delete(prod.id).subscribe({
        next: () => {
          this.cargarProductos();
          alert('Producto eliminado correctamente');
        },
        error: (err) => alert('Error al eliminar producto: ' + (err.error?.message || err.message))
      });
    }
  }

  getCategoriaNombre(categoriaId: number): string {
    const cat = this.categorias.find(c => c.id === categoriaId);
    return cat ? cat.nombre : 'Sin categoría';
  }

  getVeterinariaNombre(veterinariaId: number): string {
    const vet = this.veterinarias.find(v => v.id === veterinariaId);
    return vet ? vet.nombre : 'Sin veterinaria';
  }

  isExpired(date: string | undefined): boolean {
    if (!date) return false;
    const expirationDate = new Date(date);
    const today = new Date();
    return expirationDate < today;
  }

  // ========== CRUD CATEGORÍAS ==========
  openAddCategoriaModal(): void {
    this.showAddCategoriaModal = true;
  }

  closeAddCategoriaModal(): void {
    this.showAddCategoriaModal = false;
    this.newCategoria = { nombre: '', descripcion: '', codigo: '', color: '#4ade80', isActive: true };
  }

  guardarCategoria(): void {
    if (!this.newCategoria.nombre || !this.newCategoria.codigo) {
      alert('Por favor, completa los campos obligatorios (Nombre y Código)');
      return;
    }

    this.categoriasService.create(this.newCategoria).subscribe({
      next: () => {
        this.closeAddCategoriaModal();
        this.cargarCategorias();
        alert('Categoría registrada correctamente');
      },
      error: (err) => alert('Error al registrar categoría: ' + (err.error?.message || err.message))
    });
  }

  openEditCategoriaModal(cat: Categoria): void {
    this.editingCategoria = { ...cat };
    this.showEditCategoriaModal = true;
  }

  closeEditCategoriaModal(): void {
    this.showEditCategoriaModal = false;
    this.editingCategoria = {};
  }

  guardarEdicionCategoria(): void {
    if (!this.editingCategoria.id) return;
    const { id, createdAt, updatedAt, ...updateData } = this.editingCategoria as any;

    this.categoriasService.update(this.editingCategoria.id, updateData).subscribe({
      next: () => {
        this.closeEditCategoriaModal();
        this.cargarCategorias();
        alert('Categoría actualizada correctamente');
      },
      error: (err) => alert('Error al actualizar categoría: ' + (err.error?.message || err.message))
    });
  }

  toggleEstadoCategoria(cat: Categoria): void {
    const nuevoEstado = !cat.isActive;
    this.categoriasService.update(cat.id, { isActive: nuevoEstado }).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => alert('Error al cambiar estado: ' + (err.error?.message || err.message))
    });
  }

  eliminarCategoria(cat: Categoria): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la categoría "${cat.nombre}"?`)) {
      this.categoriasService.delete(cat.id).subscribe({
        next: () => {
          this.cargarCategorias();
          alert('Categoría eliminada correctamente');
        },
        error: (err) => alert('Error al eliminar categoría: ' + (err.error?.message || err.message))
      });
    }
  }

  // CONFIGURACIÓN ADMIN
  loadAdminProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      const avatar = currentUser.avatar || '';
      this.adminUser = {
        id: currentUser.id,
        nombres: currentUser.firstName || '',
        apellidos: currentUser.lastName || '',
        correo: currentUser.email || '',
        telefono: currentUser.phone || '',
        edad: currentUser.age || 0,
        direccion: currentUser.address || '',
        tipoDocumento: currentUser.documentType || '',
        numDocumento: currentUser.documentNumber || '',
        imagen: avatar && avatar.startsWith('/uploads/') ? `${this.baseUrl}${avatar}` : avatar,
        roleId: currentUser.roleId
      };
    }
  }

  onAdminProfileImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedAdminFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.adminProfilePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardarPerfilAdmin(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('❌ No hay usuario autenticado');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', `${this.adminUser.nombres} ${this.adminUser.apellidos}`.trim());
    formData.append('firstName', this.adminUser.nombres);
    formData.append('lastName', this.adminUser.apellidos);
    formData.append('email', this.adminUser.correo);
    formData.append('phone', this.adminUser.telefono || '');
    formData.append('age', String(this.adminUser.edad || ''));
    formData.append('address', this.adminUser.direccion || '');
    formData.append('documentType', this.adminUser.tipoDocumento || '');
    formData.append('documentNumber', this.adminUser.numDocumento || '');
    
    if (this.selectedAdminFile) {
      formData.append('avatar', this.selectedAdminFile, this.selectedAdminFile.name);
    }

    this.usersService.updateUser(currentUser.id, formData).subscribe({
      next: (response) => {
        this.authService.updateCurrentUser(response);
        this.selectedAdminFile = null;
        this.loadAdminProfile();
        alert('✅ Perfil actualizado correctamente');
      },
      error: (error) => {
        alert('❌ Error al actualizar el perfil: ' + (error.error?.message || 'Error desconocido'));
        console.error('Update profile error:', error);
      }
    });
  }

  cambiarPassword(): void {
    if (!this.newPassword || this.newPassword.length < 6) {
      alert('⚠️ La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Usar FormData para que sea compatible con el interceptor del backend
    const formData = new FormData();
    formData.append('password', this.newPassword);

    this.usersService.updateUser(currentUser.id, formData).subscribe({
      next: () => {
        alert('✅ Contraseña actualizada correctamente. Por seguridad, debes iniciar sesión de nuevo.');
        this.newPassword = '';
        this.logout(); // Cerrar sesión tras cambiar contraseña
      },
      error: (err) => {
        const errorMsg = err.error?.message;
        const detail = Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg;
        alert('❌ Error al cambiar la contraseña: ' + (detail || err.message));
      }
    });
  }

  getAdminRoleName(): string {
    const user = this.authService.getCurrentUser();
    return user?.role?.name || 'Administrador';
  }

  cambiarContrasena(): void {
    alert('Funcionalidad de cambio de contraseña próximamente disponible.');
  }

  eliminarCuentaAdmin(): void {
    if (confirm('¿Estás seguro de que deseas desactivar tu cuenta de administrador?')) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.usersService.deleteUser(currentUser.id).subscribe({
          next: () => {
            alert('✅ Cuenta desactivada exitosamente.');
            this.logout();
          },
          error: (err) => alert('❌ Error al desactivar cuenta: ' + (err.error?.message || err.message))
        });
      }
    }
  }

  // ========== CRUD VETERINARIOS ==========
  cargarVeterinarios(): void {
    this.usersService.getUsersByRoles(['veterinario']).subscribe({
      next: (data: any) => {
        console.log('Veterinarios (Users) cargados:', data);
        this.veterinarios = Array.isArray(data) ? data : [];
      },
      error: (err: any) => {
        console.error('Error al cargar veterinarios:', err);
        alert('❌ Error al cargar veterinarios: ' + (err.error?.message || err.message));
      }
    });
  }

  openAddVeterinarioModal(): void {
    this.showAddVeterinarioModal = true;
  }

  closeAddVeterinarioModal(): void {
    this.showAddVeterinarioModal = false;
    this.newVeterinario = {
      username: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      documentType: '',
      documentNumber: '',
      address: '',
      especialidad: '',
      matricula: '',
      aniosExperiencia: 0,
      universidad: '',
      telefonoProfesional: '',
      emailProfesional: '',
      biografia: '',
      veterinariaPrincipalId: 0,
      roleId: 0
    };
  }

  guardarVeterinario(): void {
    // Validar campos obligatorios
    if (!this.newVeterinario.username || !this.newVeterinario.email || !this.newVeterinario.password || 
        !this.newVeterinario.firstName || !this.newVeterinario.lastName || !this.newVeterinario.especialidad || 
        !this.newVeterinario.matricula) {
      alert('⚠️ Por favor, completa todos los campos obligatorios (*)');
      return;
    }

    if (this.newVeterinario.age && this.newVeterinario.age < 18) {
      alert('⚠️ La edad mínima permitida para registrar un veterinario es 18 años');
      return;
    }

    // Asignar automáticamente el rol de veterinario
    const rolVeterinario = this.roles.find(role => role.name.toLowerCase() === 'veterinario');
    if (!rolVeterinario) {
      alert('❌ Error: No se encontró el rol de veterinario en el sistema');
      return;
    }
    this.newVeterinario.roleId = rolVeterinario.id;

    // Datos del usuario
    const userData = {
      username: this.newVeterinario.username,
      email: this.newVeterinario.email,
      password: this.newVeterinario.password,
      firstName: this.newVeterinario.firstName,
      lastName: this.newVeterinario.lastName,
      phone: this.newVeterinario.phone,
      documentType: this.newVeterinario.documentType,
      documentNumber: this.newVeterinario.documentNumber,
      address: this.newVeterinario.address,
      age: this.newVeterinario.age,
      roleId: this.newVeterinario.roleId,
      isActive: true
    };

    this.isLoading = true;
    this.usersService.createUser(userData).subscribe({
      next: (userResponse) => {
        const perfilData = {
          especialidad: this.newVeterinario.especialidad,
          matricula: this.newVeterinario.matricula,
          aniosExperiencia: this.newVeterinario.aniosExperiencia || 0,
          universidad: this.newVeterinario.universidad || undefined,
          telefonoProfesional: this.newVeterinario.telefonoProfesional || undefined,
          emailProfesional: this.newVeterinario.emailProfesional || undefined,
          biografia: this.newVeterinario.biografia || undefined,
          veterinariaPrincipalId: this.newVeterinario.veterinariaPrincipalId || null,
          isActive: true,
          usuarioId: userResponse.id
        };

        this.http.post(`${this.baseUrl}/perfiles-veterinarios`, perfilData, { headers: this.getAuthHeaders() }).subscribe({
          next: () => {
            this.isLoading = false;
            this.closeAddVeterinarioModal();
            this.searchTermVeterinarios = ''; 
            this.currentPageVeterinarios = 1; // Resetear a la primera página
            this.cargarVeterinarios();
            alert('✅ Veterinario registrado y perfil profesional creado correctamente');
          },
          error: (err: any) => {
            this.isLoading = false;
            console.error('Error al crear perfil veterinario:', err);
            // Revertir creación de usuario si falla el perfil profesional
            this.usersService.deleteUser(userResponse.id).subscribe({
              next: () => alert('❌ Error en datos profesionales: ' + (err.error?.message || 'Error desconocido') + '. Se ha revertido la creación del usuario.'),
              error: () => alert('❌ Error crítico: Falló la creación del perfil y no se pudo eliminar el usuario huérfano. Contacte a soporte.')
            });
          }
        });
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Error al crear usuario:', err);
        alert('❌ Error al crear usuario: ' + (err.error?.message || err.message));
      }
    });
  }

  openEditVeterinarioModal(user: any): void {
    this.editingUsuario = { ...user };
    this.editingVeterinario = user.perfilVeterinario ? { ...user.perfilVeterinario } : {
      especialidad: '',
      matricula: '',
      aniosExperiencia: 0,
      universidad: '',
      telefonoProfesional: '',
      emailProfesional: '',
      biografia: '',
      veterinariaPrincipalId: 0,
      isActive: true
    };
    
    // Si la veterinaria viene como objeto, extraemos el ID para el select
    if (this.editingVeterinario.veterinariaPrincipal && !this.editingVeterinario.veterinariaPrincipalId) {
      this.editingVeterinario.veterinariaPrincipalId = this.editingVeterinario.veterinariaPrincipal.id;
    }

    this.showEditVeterinarioModal = true;
  }

  closeEditVeterinarioModal(): void {
    this.showEditVeterinarioModal = false;
    this.editingVeterinario = {};
    this.editingUsuario = {};
  }

  guardarEdicionVeterinario(): void {
    if (!this.editingUsuario.id) return;

    if (this.editingUsuario.age && this.editingUsuario.age < 18) {
      alert('⚠️ La edad mínima permitida es 18 años');
      return;
    }

    // Solo permitir edición de campos básicos
    const userData = {
      firstName: this.editingUsuario.firstName,
      lastName: this.editingUsuario.lastName,
      phone: this.editingUsuario.phone,
      address: this.editingUsuario.address,
      email: this.editingUsuario.email,
      age: this.editingUsuario.age
    };

    this.usersService.updateUser(this.editingUsuario.id, userData).subscribe({
      next: () => {
        // Actualizar o Crear perfil veterinario
        const perfilData = {
          especialidad: this.editingVeterinario.especialidad,
          matricula: this.editingVeterinario.matricula,
          aniosExperiencia: this.editingVeterinario.aniosExperiencia,
          universidad: this.editingVeterinario.universidad || undefined,
          telefonoProfesional: this.editingVeterinario.telefonoProfesional || undefined,
          emailProfesional: this.editingVeterinario.emailProfesional || undefined,
          biografia: this.editingVeterinario.biografia || undefined,
          veterinariaPrincipalId: this.editingVeterinario.veterinariaPrincipalId || null,
          isActive: this.editingVeterinario.isActive,
          usuarioId: this.editingUsuario.id
        };

        const request = this.editingVeterinario.id 
          ? this.http.patch(`${this.baseUrl}/perfiles-veterinarios/${this.editingVeterinario.id}`, perfilData, { headers: this.getAuthHeaders() })
          : this.http.post(`${this.baseUrl}/perfiles-veterinarios`, perfilData, { headers: this.getAuthHeaders() });

          request.subscribe({
            next: () => {
              this.closeEditVeterinarioModal();
              this.cargarVeterinarios();
              alert('✅ Datos del veterinario actualizados correctamente');
            },
            error: (err: any) => {
              console.error('Error al actualizar perfil veterinario:', err);
              alert('❌ Error al actualizar perfil profesional: ' + (err.error?.message || err.message));
            }
          });
        },
        error: (err: any) => {
          console.error('Error al actualizar usuario:', err);
          alert('❌ Error al actualizar usuario: ' + (err.error?.message || err.message));
        }
      });
  }

  toggleEstadoVeterinario(user: any): void {
    const nuevoEstado = !user.isActive;
    
    // Actualizar estado del usuario directamente
    this.usersService.updateUser(user.id, { isActive: nuevoEstado }).subscribe({
      next: () => this.cargarVeterinarios(),
      error: (err: any) => alert('Error al cambiar estado: ' + (err.error?.message || err.message))
    });
  }
}
