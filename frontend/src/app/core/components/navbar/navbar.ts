import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  profileMenuAbierto = false;
  modoOscuro = false;
  usuarioLogueado: any = null;
  showScrollTop = false;

  public userModules = inject(AuthService).userModules;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.modoOscuro = this.themeService.isDarkMode;
    this.themeService.darkMode$.subscribe(dark => this.modoOscuro = dark);
    
    // Load user from AuthService signal
    this.loadUser();
  }

  private loadUser(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.usuarioLogueado = {
        id: user.id,
        roleId: Number(user.roleId || user.role?.id),
        nombre: user.fullName || user.username || 'Usuario',
        email: user.email,
        avatar: this.getFullAvatarUrl(user.avatar)
      };
    }
  }

  private getFullAvatarUrl(avatarPath: string | null): string {
    if (!avatarPath) return 'assets/images/Default.png';
    if (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) return avatarPath;
    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `http://localhost:3000${cleanPath}`;
  }

  hasAccess(module: string): boolean {
    return this.userModules().includes(module.toLowerCase());
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleProfileMenu() {
    // Refresh user data each time profile menu is toggled
    this.loadUser();
    this.profileMenuAbierto = !this.profileMenuAbierto;
  }

  toggleModoOscuro() {
    this.themeService.toggleDarkMode();
  }

  logout() {
    this.authService.logout();
    this.usuarioLogueado = null;
    this.themeService.setDarkMode(false);
    this.router.navigate(['/login']);
  }

  get isInicio(): boolean {
    return this.router.url === '/inicio';
  }

  get isVeterinario(): boolean {
    return this.usuarioLogueado?.roleId === 3;
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  irAPerfil() {
    if (this.hasAccess('veterinario')) {
      this.router.navigate(['/veterinario']);
    } else {
      this.router.navigate(['/perfil-usuario']);
    }
  }

  irATienda() {
    this.router.navigate(['/tienda']);
  }

  irASobreNosotros() {
    this.router.navigate(['/sobre-nosotros']);
  }

  irATickets() {
    this.router.navigate(['/inicio']);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.isMenuOpen = false;
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-section')) {
      this.profileMenuAbierto = false;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
