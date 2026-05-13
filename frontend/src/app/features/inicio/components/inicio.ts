import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { PublicacionesService } from '../services/publicaciones.service';
import { AnnouncementsService, Announcement } from '../../../core/services/announcements.service';
import { TicketsService, CreateTicketDto } from '../../../core/services/tickets.service';
import { PreloaderComponent } from '../../../shared/components/preloader/preloader';

interface Publicacion {
  id: number;
  autorId?: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  imagen?: string;
  fecha: Date;
  likes: number;
  comentarios: Comentario[];
  compartidos: number;
  likedByUser: boolean;
  mostrarComentarios: boolean;
  // Animation states
  likeAnimating?: boolean;
  shareAnimating?: boolean;
  justPublished?: boolean;
}

interface Comentario {
  id: number;
  usuario: {
    nombre: string;
    avatar: string;
  };
  contenido: string;
  fecha: Date;
  justAdded?: boolean;
}

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PreloaderComponent],
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.scss']
})
export class Inicio implements OnInit {
  usuarioLogueado: any = null;
  publicaciones: Publicacion[] = [];
  nuevaPublicacion: string = '';
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  menuAbierto: boolean = false;
  profileMenuAbierto: boolean = false;
  modoOscuro: boolean = false;
  showScrollTop: boolean = false;
  nuevoComentario: { [key: number]: string } = {};
  currentPlaceholder: string = '';
  activeAnnouncements: Announcement[] = [];
  showAnnouncementBanner: boolean = true;
  showTicketModal: boolean = false;
  newTicket: CreateTicketDto = {
    asunto: '',
    descripcion: '',
    prioridad: 'Media'
  };

  // Preloader is now self-managed by PreloaderComponent

  private placeholders = [
    '¿Qué travesura hizo hoy tu mascota? 😏',
    'Comparte algo adorable 🐾',
    '¿Tu mascota hizo algo gracioso? ¡Cuéntanos! 😂',
    '¿Cómo está tu peludo hoy? 🐶',
    'Sube una foto de tu mascota 📸✨',
    '¿Qué aventura vivió tu mascota hoy? 🌟',
    'Comparte un consejo para mascotas 💡🐱',
    '¿Tu mascota te robó el corazón hoy? ❤️🐕'
  ];

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authService: AuthService,
    private publicacionesService: PublicacionesService,
    private announcementsService: AnnouncementsService,
    private ticketsService: TicketsService
  ) {}

  getRandomPlaceholder(): string {
    return this.placeholders[Math.floor(Math.random() * this.placeholders.length)];
  }

  ngOnInit(): void {
    this.initializeInicio();
  }

  private async initializeInicio(): Promise<void> {
    try {
      // Set up theme first
      this.modoOscuro = this.themeService.isDarkMode;
      this.themeService.darkMode$.subscribe(dark => this.modoOscuro = dark);

      // Load user data
      const user = this.authService.currentUser();
      if (user) {
        this.usuarioLogueado = {
          nombre: user.fullName || user.username || 'Usuario',
          email: user.email,
          avatar: user.avatar 
            ? (user.avatar.startsWith('/uploads/') ? `http://localhost:3000${user.avatar}` : user.avatar) 
            : 'assets/images/Default.png'
        };
      } else if (this.authService.isLoggedIn()) {
        try {
          await this.authService.reloadUser();
          const reloadedUser = this.authService.currentUser();
          if (reloadedUser) {
            this.usuarioLogueado = {
              nombre: reloadedUser.fullName || reloadedUser.username || 'Usuario',
              email: reloadedUser.email,
              avatar: reloadedUser.avatar 
                ? (reloadedUser.avatar.startsWith('/uploads/') ? `http://localhost:3000${reloadedUser.avatar}` : reloadedUser.avatar) 
                : 'assets/images/Default.png'
            };
          }
        } catch (error) {
          console.error('Error al recargar usuario:', error);
        }
      }

      this.currentPlaceholder = this.getRandomPlaceholder();

      // Load real publications
      await this.cargarPublicaciones();
      
      // Load active announcements
      this.loadActiveAnnouncements();
    } catch (error) {
      console.error('Error al inicializar inicio:', error);
    }
  }


  private async cargarPublicaciones(): Promise<void> {
    return new Promise((resolve) => {
      console.log('Frontend: Solicitando todas las publicaciones...');
      this.publicacionesService.getPublicaciones().subscribe({
        next: (publicaciones) => {
          console.log('Frontend: Publicaciones recibidas del backend:', publicaciones);
          this.publicaciones = publicaciones.map(pub => {
            const autor = pub.autor;
            if (!autor) {
              console.warn(`Publicación ID ${pub.id} no tiene autor asociado.`);
            }
            return {
              id: pub.id,
              autorId: pub.autorId,
              usuario: {
                nombre: autor ? (autor.fullName || `${autor.firstName || ''} ${autor.lastName || ''}`.trim() || autor.username || 'Usuario') : 'Usuario',
                avatar: autor?.avatar 
                  ? (autor.avatar.startsWith('/uploads/') ? `http://localhost:3000${autor.avatar}` : autor.avatar)
                  : 'assets/images/Default.png'
              },
              contenido: pub.descripcion,
              imagen: pub.imagen && pub.imagen.startsWith('/uploads/') ? `http://localhost:3000${pub.imagen}` : pub.imagen,
              fecha: new Date(pub.createdAt),
              likes: pub.likes || 0,
              comentarios: [],
              compartidos: 0,
              likedByUser: false,
              mostrarComentarios: false
            };
          });
          console.log(`Frontend: ${this.publicaciones.length} publicaciones mapeadas y listas para mostrar.`);
        },
        error: (err) => {
          console.error('Frontend: ❌ Error al cargar todas las publicaciones:', err);
          this.publicaciones = [];
        }
      }).add(() => {
        resolve();
      });
    });
  }

  private loadActiveAnnouncements(): void {
    this.announcementsService.getActive().subscribe({
      next: (announcements) => {
        this.activeAnnouncements = announcements;
      },
      error: (err) => {
        console.error('Error loading active announcements:', err);
        this.activeAnnouncements = [];
      }
    });
  }

  closeAnnouncementBanner(): void {
    this.showAnnouncementBanner = false;
  }

  // ===== TICKETS =====
  openTicketModal(): void {
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

    const user = this.authService.getCurrentUser();
    if (!user) {
      alert('Debes estar logueado para crear un ticket');
      return;
    }

    this.ticketsService.create(this.newTicket).subscribe({
      next: () => {
        this.closeTicketModal();
        alert('Ticket creado correctamente. Te responderemos pronto.');
      },
      error: (err) => {
        console.error('Error creating ticket:', err);
        alert('Error al crear ticket. Por favor intenta nuevamente.');
      }
    });
  }

  irATickets(): void {
    this.openTicketModal();
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  toggleProfileMenu(): void {
    this.profileMenuAbierto = !this.profileMenuAbierto;
  }

  toggleModoOscuro(): void {
    this.themeService.toggleDarkMode();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  eliminarImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
  }

  publicar(): void {
    if (this.nuevaPublicacion.trim() || this.imagenSeleccionada) {
      const user = this.authService.getCurrentUser();
      const formData = new FormData();
      formData.append('descripcion', this.nuevaPublicacion);
      formData.append('autorId', String(user?.userId || user?.id || ''));
      if (this.imagenSeleccionada) {
        formData.append('imagen', this.imagenSeleccionada, this.imagenSeleccionada.name);
      }

      this.publicacionesService.crearPublicacion(formData).subscribe({
        next: (publicacionCreada) => {
          const nuevaPublicacion: Publicacion = {
            id: publicacionCreada.id,
            autorId: publicacionCreada.autorId,
            usuario: {
              nombre: this.usuarioLogueado?.nombre || 'Usuario',
              avatar: this.usuarioLogueado?.avatar || 'assets/images/Default.png'
            },
            contenido: publicacionCreada.descripcion,
            imagen: publicacionCreada.imagen ? `http://localhost:3000${publicacionCreada.imagen}` : undefined,
            fecha: new Date(publicacionCreada.createdAt),
            likes: 0,
            comentarios: [],
            compartidos: 0,
            likedByUser: false,
            mostrarComentarios: false,
            justPublished: true
          };
          this.publicaciones.unshift(nuevaPublicacion);
          this.nuevaPublicacion = '';
          this.currentPlaceholder = this.getRandomPlaceholder();
          this.eliminarImagen();

          // Remove animation class after animation ends
          setTimeout(() => {
            nuevaPublicacion.justPublished = false;
          }, 800);
        },
        error: (err) => {
          console.error('Error al crear publicación:', err);
          alert('Error al crear la publicación. Por favor intenta nuevamente.');
        }
      });
    }
  }

  darLike(publicacion: Publicacion): void {
    publicacion.likeAnimating = true;
    if (publicacion.likedByUser) {
      publicacion.likes--;
    } else {
      publicacion.likes++;
    }
    publicacion.likedByUser = !publicacion.likedByUser;

    // Remove animation class after animation ends
    setTimeout(() => {
      publicacion.likeAnimating = false;
    }, 600);
  }

  toggleComentarios(publicacion: Publicacion): void {
    publicacion.mostrarComentarios = !publicacion.mostrarComentarios;
  }

  agregarComentario(publicacion: Publicacion): void {
    const contenido = this.nuevoComentario[publicacion.id];
    if (contenido && contenido.trim()) {
      const nuevoComentario: Comentario = {
        id: publicacion.comentarios.length + 1,
        usuario: {
          nombre: this.usuarioLogueado?.nombre || 'Usuario',
          avatar: this.usuarioLogueado?.avatar || 'assets/images/Default.png'
        },
        contenido: contenido,
        fecha: new Date(),
        justAdded: true
      };
      publicacion.comentarios.push(nuevoComentario);
      this.nuevoComentario[publicacion.id] = '';

      // Remove animation class after animation ends
      setTimeout(() => {
        nuevoComentario.justAdded = false;
      }, 600);
    }
  }

  compartir(publicacion: Publicacion): void {
    publicacion.shareAnimating = true;
    publicacion.compartidos++;

    setTimeout(() => {
      publicacion.shareAnimating = false;
    }, 800);
  }

  getTiempoTranscurrido(fecha: Date): string {
    const ahora = new Date();
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffSegundos = Math.floor(diffMs / 1000);
    const diffMinutos = Math.floor(diffSegundos / 60);
    const diffHoras = Math.floor(diffMinutos / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffSegundos < 60) {
      return 'ahora mismo';
    } else if (diffMinutos < 60) {
      return `hace ${diffMinutos} minuto${diffMinutos !== 1 ? 's' : ''}`;
    } else if (diffHoras < 24) {
      return `hace ${diffHoras} hora${diffHoras !== 1 ? 's' : ''}`;
    } else if (diffDias < 7) {
      return `hace ${diffDias} día${diffDias !== 1 ? 's' : ''}`;
    } else {
      return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: fecha.getFullYear() !== ahora.getFullYear() ? 'numeric' : undefined
      });
    }
  }

  getUser(): any {
    return this.usuarioLogueado;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irAPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  irATienda(): void {
    this.router.navigate(['/tienda']);
  }

  irAAdopciones(): void {
    this.router.navigate(['/adopcion']);
  }

  irASobreNosotros(): void {
    this.router.navigate(['/sobre-nosotros']);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.showScrollTop = window.scrollY > 300;
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
