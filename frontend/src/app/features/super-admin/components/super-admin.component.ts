import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
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
  styleUrl: './super-admin.component.scss'
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

  // Inject Router
  private router = inject(Router);

  constructor(
    private rolesService: RolesService,
    private modulesService: ModulesService,
    private usersService: UsersService,
    private petsService: PetsService,
    private veterinariasService: VeterinariasService,
    private themeService: ThemeService,
    private authService: AuthService
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
      next: (users) => this.allUsers = users,
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
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irAInicio(): void {
    this.router.navigate(['/inicio']);
  }

  getAdminRoleName(): string {
    const user = this.authService.getCurrentUser();
    return user?.role?.name || 'Super Admin';
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
}
