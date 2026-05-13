import { Component, OnInit, ViewEncapsulation, inject, ChangeDetectorRef, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RolesService, Role } from '../../../core/services/roles.service';
import { ModulesService, Module } from '../../../core/services/modules.service';
import { UsersService } from '../../../core/services/users.service';
import { PetsService, Pet } from '../../../core/services/pets.service';
import { VeterinariasService, Veterinaria } from '../../../core/services/veterinarias.service';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class SuperAdminComponent implements OnInit {
  // UI State
  activeTab: string = 'dashboard';
  sidebarOpen: boolean = true;
  modoOscuro: boolean = false;
  private themeSub!: Subscription;

  // Data
  roles: Role[] = [];
  modules: Module[] = [];
  allUsers: any[] = [];
  allPets: Pet[] = [];
  allVets: Veterinaria[] = [];
  
  // Role Selection for Modules
  selectedRoleForModules: Role | null = null;
  roleModules: string[] = [];

  // Modals
  showRoleModal: boolean = false;
  isEditingRole: boolean = false;
  currentRole: Partial<Role> = {};

  showAddVeterinariaModal: boolean = false;
  showEditVeterinariaModal: boolean = false;
  showNewAdminModal: boolean = false;
  newVeterinaria: Partial<Veterinaria> = {
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    rut: '',
    descripcion: '',
    isActive: true,
    adminId: undefined
  };
  editingVeterinaria: Partial<Veterinaria> = {};
  newAdmin: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    address: '',
    age: null,
    roleId: undefined,
    password: '',
    confirmPassword: ''
  };

  // Inject Router
  private router = inject(Router);

  constructor(
    private rolesService: RolesService,
    private modulesService: ModulesService,
    private usersService: UsersService,
    private petsService: PetsService,
    private veterinariasService: VeterinariasService,
    private themeService: ThemeService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadModules();
    this.loadGlobalData();
    
    this.themeSub = this.themeService.darkMode$.subscribe(isDark => {
      this.modoOscuro = isDark;
    });
  }

  loadGlobalData(): void {
    this.usersService.getAllUsers().subscribe({
      next: (users) => this.allUsers = users.filter(user => user.role?.name === 'admin' || user.roleId === 2),
      error: (err) => console.error('Error loading all users:', err)
    });

    this.petsService.getAll().subscribe({
      next: (pets) => this.allPets = pets,
      error: (err) => console.error('Error loading all pets:', err)
    });

    this.veterinariasService.getAll().subscribe({
      next: (vets) => this.allVets = vets,
      error: (err) => console.error('Error loading all vets:', err)
    });
  }

  // ===== UI HELPERS =====
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleDarkMode(): void {
    this.themeService.toggleDarkMode();
  }

  setSection(section: string): void {
    this.activeTab = section;
    if (section === 'users' || section === 'dashboard') {
      this.loadGlobalData();
    }
  }

  getFullImageUrl(path: string | null | undefined): string {
    if (!path) return 'assets/images/Default.png';
    if (path.startsWith('http')) return path;
    return `http://localhost:3000${path}`;
  }

  toggleUserStatus(user: any): void {
    this.ngZone.run(() => {
      const originalStatus = user.isActive;
      const newStatus = !originalStatus;
      
      console.log('🔄 [toggleUserStatus] Cambiando estado de usuario:', user.username, 'de', originalStatus, 'a', newStatus);
      
      // Encontrar el índice del usuario en el array
      const index = this.allUsers.findIndex(u => u.id === user.id);
      if (index === -1) return;
      
      // Crear una copia del usuario con el nuevo estado
      const updatedUser = { ...this.allUsers[index], isActive: newStatus };
      
      // Reemplazar el objeto en el array para forzar detección de cambios
      this.allUsers = [...this.allUsers];
      this.allUsers[index] = updatedUser;
      
      // Forzar detección de cambios para actualizar la UI inmediatamente
      this.cdr.detectChanges();

      this.usersService.updateUser(user.id, { isActive: newStatus }).subscribe({
        next: (response) => {
          console.log('✅ Estado actualizado en servidor:', response.username, response.isActive);
          // Actualizar el objeto en el array con la respuesta del servidor
          this.allUsers = [...this.allUsers];
          this.allUsers[index] = { ...this.allUsers[index], ...response };
          // Forzar detección de cambios nuevamente después de la respuesta
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(`❌ Error al cambiar estado:`, err);
          // Revertir al estado original en caso de error
          this.allUsers = [...this.allUsers];
          this.allUsers[index] = { ...this.allUsers[index], isActive: originalStatus };
          // Forzar detección de cambios para revertir la UI en caso de error
          this.cdr.detectChanges();
          alert('No se pudo cambiar el estado. Revisa tu conexión.');
        }
      });
    });
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }

  logout(): void {
    console.log('🚪 [SuperAdmin] Cerrando sesión y destruyendo datos...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  getAdminRoleName(): string {
    const user = this.authService.getCurrentUser();
    return user?.role?.name || 'Super Administrador';
  }

  getAdminProfileImage(): string {
    const user = this.authService.getCurrentUser();
    return user?.avatar || 'assets/images/Default.png';
  }

  // ===== ROLES =====
  loadRoles(): void {
    this.rolesService.getRoles().subscribe({
      next: (data) => this.roles = data,
      error: (err) => console.error('Error loading roles:', err)
    });
  }

  openNewRoleModal(): void {
    this.isEditingRole = false;
    this.currentRole = { name: '', description: '' };
    this.showRoleModal = true;
  }

  editRole(role: Role): void {
    this.isEditingRole = true;
    this.currentRole = { 
      id: role.id,
      name: role.name,
      description: role.description
    };
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.currentRole = { name: '', description: '' };
  }

  saveRole(): void {
    const name = (this.currentRole.name || '').trim();
    const description = (this.currentRole.description || '').trim();

    if (name.length < 2) {
      alert('⚠️ Error de Validación:\nEl sistema recibió el nombre: "' + name + '" (' + name.length + ' letras).\nSe requieren al menos 2 caracteres.');
      return;
    }

    const cleanPayload = { name, description };
    const id = this.currentRole.id;

    console.log('📦 Enviando datos al servidor:', cleanPayload);

    if (this.isEditingRole && id) {
      this.rolesService.update(id, cleanPayload).subscribe({
        next: () => {
          this.loadRoles();
          this.closeRoleModal();
        },
        error: (err) => {
          const msg = err.error?.message;
          const errorDetail = Array.isArray(msg) ? msg[0] : msg;
          console.error('❌ Error updating role:', errorDetail || err.message);
          alert('Error al actualizar: ' + (errorDetail || 'Error desconocido'));
        }
      });
    } else {
      this.rolesService.create(cleanPayload).subscribe({
        next: () => {
          this.loadRoles();
          this.closeRoleModal();
        },
        error: (err) => {
          const msg = err.error?.message;
          const errorDetail = Array.isArray(msg) ? msg[0] : msg;
          console.error('❌ Error creating role:', errorDetail || err.message);
          alert('Error al crear: ' + (errorDetail || 'Error desconocido'));
        }
      });
    }
  }

  deleteRole(id: number): void {
    if (confirm('¿Estás seguro de eliminar este rol?')) {
      this.rolesService.delete(id).subscribe({
        next: () => this.loadRoles(),
        error: (err) => console.error('Error deleting role:', err)
      });
    }
  }

  // ===== MODULES & PERMISSIONS =====
  loadModules(): void {
    this.modulesService.getModules().subscribe({
      next: (modules) => this.modules = modules,
      error: (err) => console.error('Error loading modules:', err)
    });
  }

  onRoleChange(event: any): void {
    const roleId = event.target.value;
    if (!roleId) {
      this.selectedRoleForModules = null;
      this.roleModules = [];
      return;
    }

    const role = this.roles.find(r => r.id == roleId);
    if (role) {
      this.selectedRoleForModules = role;
      // Cargar módulos actuales del rol si vienen en el objeto
      if (role.modules) {
        this.roleModules = role.modules.map((m: any) => m.name);
      } else {
        this.roleModules = [];
      }
    }
  }

  hasModule(moduleName: string): boolean {
    return this.roleModules.includes(moduleName);
  }

  toggleModule(moduleName: string): void {
    const index = this.roleModules.indexOf(moduleName);
    if (index > -1) {
      this.roleModules.splice(index, 1);
    } else {
      this.roleModules.push(moduleName);
    }
    
    // Guardar automáticamente al cambiar
    this.savePermissions();
  }

  savePermissions(): void {
    if (this.selectedRoleForModules) {
      this.modulesService.assignModulesToRole(this.selectedRoleForModules.id, this.roleModules).subscribe({
        next: () => {
          // Actualizar el objeto local para que se mantenga sincronizado
          if (this.selectedRoleForModules) {
            this.selectedRoleForModules.modules = this.modules.filter((m: Module) => this.roleModules.includes(m.name));
          }
        },
        error: (err) => console.error('Error saving permissions:', err)
      });
    }
  }

  seedInitialModules(): void {
    if (confirm('¿Quieres regenerar los módulos iniciales del sistema?')) {
      this.modulesService.seedModules().subscribe({
        next: () => this.loadModules(),
        error: (err) => console.error('Error seeding modules:', err)
      });
    }
  }

  // ===== VETERINARIAS CRUD =====
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
      isActive: true,
      adminId: undefined
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
        this.loadGlobalData();
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
    if (!this.editingVeterinaria.id || !this.editingVeterinaria.nombre || !this.editingVeterinaria.direccion) {
      alert('Por favor, completa los campos obligatorios');
      return;
    }

    this.veterinariasService.update(this.editingVeterinaria.id, this.editingVeterinaria).subscribe({
      next: () => {
        this.closeEditVeterinariaModal();
        this.loadGlobalData();
        alert('Veterinaria actualizada correctamente');
      },
      error: (err) => alert('Error al actualizar veterinaria: ' + (err.error?.message || err.message))
    });
  }

  // ===== NUEVO ADMINISTRADOR =====
  openNewAdminModal(): void {
    this.newAdmin = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentType: '',
      documentNumber: '',
      address: '',
      age: null,
      roleId: undefined,
      password: '',
      confirmPassword: ''
    };
    this.showNewAdminModal = true;
  }

  closeNewAdminModal(): void {
    this.showNewAdminModal = false;
    this.newAdmin = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      documentType: '',
      documentNumber: '',
      address: '',
      age: null,
      roleId: undefined,
      password: '',
      confirmPassword: ''
    };
  }

  saveNewAdmin(): void {
    // Validaciones
    if (!this.newAdmin.firstName || !this.newAdmin.lastName || !this.newAdmin.email || 
        !this.newAdmin.documentType || !this.newAdmin.documentNumber || 
        !this.newAdmin.age || !this.newAdmin.roleId || !this.newAdmin.password || !this.newAdmin.confirmPassword) {
      alert('Por favor, completa todos los campos obligatorios');
      return;
    }

    if (this.newAdmin.firstName.length < 2 || this.newAdmin.lastName.length < 2) {
      alert('El nombre y apellido deben tener al menos 2 caracteres');
      return;
    }

    if (this.newAdmin.password.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.newAdmin.password !== this.newAdmin.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.newAdmin.age < 18) {
      alert('El administrador debe ser mayor de 18 años');
      return;
    }

    if (this.newAdmin.documentNumber.length < 5) {
      alert('El número de documento debe tener al menos 5 caracteres');
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newAdmin.email)) {
      alert('Por favor, ingresa un correo electrónico válido');
      return;
    }

    // Generar username automáticamente basado en nombre y apellido
    const firstName = this.newAdmin.firstName.trim().toLowerCase();
    const lastName = this.newAdmin.lastName.trim().toLowerCase();
    const username = `${firstName}.${lastName}`;

    // Preparar el payload para enviar al backend
    const adminPayload = {
      username: username,
      firstName: this.newAdmin.firstName.trim(),
      lastName: this.newAdmin.lastName.trim(),
      email: this.newAdmin.email.trim().toLowerCase(),
      phone: this.newAdmin.phone?.trim() || null,
      documentType: this.newAdmin.documentType,
      documentNumber: this.newAdmin.documentNumber.trim(),
      address: this.newAdmin.address?.trim() || null,
      age: parseInt(this.newAdmin.age),
      roleId: this.newAdmin.roleId,
      password: this.newAdmin.password,
      isActive: true
    };

    console.log('📦 Enviando datos de nuevo administrador:', adminPayload);

    // Llamar al servicio para crear el usuario
    this.usersService.createUser(adminPayload).subscribe({
      next: (response) => {
        console.log('✅ Administrador creado exitosamente:', response);
        this.closeNewAdminModal();
        this.loadGlobalData(); // Recargar la lista de administradores
        alert('Administrador creado correctamente');
      },
      error: (err) => {
        console.error('❌ Error al crear administrador:', err);
        const errorMessage = err.error?.message || err.message || 'Error desconocido';
        alert('Error al crear administrador: ' + errorMessage);
      }
    });
  }
}
