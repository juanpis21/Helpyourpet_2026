import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  profileMenuAbierto = false;
  modoOscuro = false;
  usuarioLogueado: any = null;
  showScrollTop = false;

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
      const isVet = user.role?.name?.toLowerCase() === 'veterinario';
      this.usuarioLogueado = {
        id: user.id,
        roleName: user.role?.name,
        nombre: isVet 
          ? (user.fullName || (user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Usuario'))
          : (user.fullName || 'Usuario'),
        email: user.email,
        avatar: this.getFullAvatarUrl(user.avatar)
      };
    }
  }

  private getFullAvatarUrl(avatarPath: string | null): string {
    if (!avatarPath) return 'assets/images/Default.png';
    if (avatarPath.startsWith('http') || avatarPath.startsWith('data:')) return avatarPath;
    const cleanPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`;
    return `${environment.apiUrl}${cleanPath}`;
  }

  hasAccess(module: string): boolean {
    return this.authService.userModules().includes(module.toLowerCase());
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
    return this.router.url.split('?')[0] === '/inicio';
  }

  get isTienda(): boolean {
    return this.router.url.split('?')[0] === '/tienda';
  }

  get isSobreNosotros(): boolean {
    return this.router.url.split('?')[0] === '/sobre-nosotros';
  }

  get isPerfil(): boolean {
    const path = this.router.url.split('?')[0];
    return path === '/perfil-usuario' || path === '/veterinario';
  }

  get isVeterinario(): boolean {
    return this.usuarioLogueado?.roleName?.toLowerCase() === 'veterinario';
  }

  get isUsuario(): boolean {
    return this.usuarioLogueado?.roleName?.toLowerCase() === 'usuario';
  }

  irAInicio() {
    this.router.navigate(['/inicio']);
  }

  irAPerfil() {
    if (this.isVeterinario || this.hasAccess('veterinario')) {
      this.router.navigate(['/veterinario']);
    } else if (this.isUsuario || this.hasAccess('perfil-usuario')) {
      this.router.navigate(['/perfil-usuario']);
    } else {
      this.router.navigate(['/inicio']);
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
