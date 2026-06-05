import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { VeterinariasService } from '../../../core/services/veterinarias.service';
import { ProductosService } from '../../../core/services/productos.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { Subscription } from 'rxjs';

import { PreloaderComponent } from '../../../shared/components/preloader/preloader';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PreloaderComponent],
  templateUrl: './tienda.html',
  styleUrl: './tienda.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Tienda implements OnInit, OnDestroy {
  // Control de vistas: 'tiendas' | 'productos'
  vista: string = 'tiendas';
  baseUrl: string = 'http://localhost:3000';

  // Modo oscuro
  modoOscuro: boolean = false;

  // Loading flag for products
  cargandoProductos: boolean = false;
  private themeSub!: Subscription;

  // Perfil
  profileMenuAbierto: boolean = false;
  currentUser: any = null;

  // Datos
  // Datos reales
  tiendas: any[] = [];
  tiendaSeleccionada: any = null;
  productos: any[] = [];
  carrito: any[] = [];

  // Filtros
  categorias: any[] = [];
  filtroCategoria: string = 'all';
  filtroOrden: string = 'featured';

  // Carrusel
  slideActual: number = 0;

  // Carrito
  carritoVisible: boolean = false;


  constructor(
    private http: HttpClient, 
    private themeService: ThemeService, 
    private authService: AuthService,
    private veterinariasService: VeterinariasService,
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  // Intervalo para el carrusel
  private carouselInterval: any;

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarTiendas();
    this.cargarCategorias();

    // Sincronizar modo oscuro con ThemeService
    this.themeSub = this.themeService.darkMode$.subscribe(isDark => {
      this.modoOscuro = isDark;
    });

    // Escuchar respuestas de pago desde Stripe
    this.route.queryParams.subscribe(params => {
      if (params['payment'] === 'success') {
        this.confirmarVentaStripe();
      } else if (params['payment'] === 'cancelled') {
        Swal.fire({
          icon: 'error',
          title: 'Pago Cancelado',
          text: 'El proceso de pago con Stripe fue cancelado.',
          confirmButtonColor: '#1d3976'
        });
        this.router.navigate([], { queryParams: {} });
      }
    });
  }

  confirmarVentaStripe(): void {
    this.cargandoProductos = true;
    const token = this.authService.getToken();
    const headers = { 'Authorization': `Bearer ${token}` };

    this.http.post<any>(
      `${this.baseUrl}/ventas/checkout`,
      {},
      { headers }
    ).subscribe({
      next: (venta) => {
        this.cargandoProductos = false;
        this.carrito = [];
        localStorage.removeItem('checkoutCart');
        this.router.navigate([], { queryParams: {} });

        Swal.fire({
          icon: 'success',
          title: '¡Pago Exitoso!',
          text: `Tu compra se ha procesado con éxito. Orden de venta #${venta.id}`,
          confirmButtonColor: '#1d3976'
        });
      },
      error: (err) => {
        this.cargandoProductos = false;
        this.router.navigate([], { queryParams: {} });
        console.error('Error al procesar checkout de Stripe:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error de Procesamiento',
          text: err.error?.message || 'No se pudo registrar la venta en la base de datos.',
          confirmButtonColor: '#1d3976'
        });
      }
    });
  }

  ngOnDestroy(): void {
    // Limpiar intervalo al destruir el componente
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  // Cargar usuario actual
  private cargarUsuario(): void {
    const userData = localStorage.getItem('current_user');
    if (userData) {
      this.currentUser = JSON.parse(userData);
    }
  }

  // ===== FUNCIONES DE TIENDAS =====
  cargarTiendas(): void {
    this.veterinariasService.getAll().subscribe({
      next: (tiendas) => {
        this.tiendas = tiendas.map(t => ({
          ...t,
          horario: 'Lun-Sáb: 8:00 AM - 7:00 PM', // Placeholder
          estado: t.isActive ? 'Activo' : 'Cerrado'
        }));
        this.cdr.detectChanges();
      },
      error: (error) => console.error('❌ Error al cargar tiendas:', error)
    });
  }

  seleccionarTienda(tienda: any): void {
    this.tiendaSeleccionada = tienda;
    // Show preloader while loading products
    this.cargandoProductos = true;
    this.cargarProductosTienda(tienda.id);

    // Cambiar a vista de productos
    this.vista = 'productos';

    // Iniciar carrusel automático al entrar a productos
    this.iniciarCarrusel();

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  volverATiendas(): void {
    this.vista = 'tiendas';
    this.tiendaSeleccionada = null;
    this.productos = [];

    // Detener carrusel al volver a tiendas
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log('🔙 Volviendo a la selección de tiendas');
  }

  cargarCategorias(): void {
    this.categoriasService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar categorías:', err)
    });
  }

  // ===== FUNCIONES DE PRODUCTOS =====
  cargarProductosTienda(tiendaId: number): void {
    this.productosService.getAll().subscribe({
      next: (allProducts) => {
        this.productos = allProducts
          .filter(p => p.veterinariaId === tiendaId && p.isActive)
          .map(p => {
            const cat = this.categorias.find(c => c.id === p.categoriaId);
            return {
              id: p.id,
              nombre: p.nombre,
              descripcion: p.descripcion,
              precio: p.precioVenta,
              categoria: cat ? cat.nombre : 'General',
              categoriaId: p.categoriaId,
              imagen: p.imagen ? this.baseUrl + p.imagen : 'assets/IMG/default.jpg',
              stockActual: p.stockActual
            };
          });
        this.cdr.detectChanges();
        // Loading complete
        this.cargandoProductos = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
        this.productos = [];
        this.cargandoProductos = false;
      }
    });
  }

  get filteredProducts(): any[] {
    let filtered = [...this.productos];

    if (this.filtroCategoria !== 'all') {
      filtered = filtered.filter(p => p.categoria === this.filtroCategoria);
    }

    if (this.filtroOrden === 'price-low') {
      filtered.sort((a, b) => a.precio - b.precio);
    } else if (this.filtroOrden === 'price-high') {
      filtered.sort((a, b) => b.precio - a.precio);
    } else if (this.filtroOrden === 'name') {
      filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }

    return filtered;
  }

  // ===== FUNCIONES DE CARRITO =====
  agregarAlCarrito(producto: any): void {
    const existente = this.carrito.find(item => item.id === producto.id);

    if (existente) {
      if (existente.quantity >= (producto.stockActual || 0)) {
        Swal.fire({
          icon: 'warning',
          title: 'Stock Límite Alcanzado',
          text: `No hay más stock disponible para "${producto.nombre}".`,
          confirmButtonColor: '#1d3976'
        });
        return;
      }
      existente.quantity++;
    } else {
      if ((producto.stockActual || 0) <= 0) {
        Swal.fire({
          icon: 'error',
          title: 'Producto Agotado',
          text: `El producto "${producto.nombre}" no tiene stock disponible.`,
          confirmButtonColor: '#1d3976'
        });
        return;
      }
      this.carrito.push({ ...producto, quantity: 1 });
    }

    console.log('🛒 Producto agregado:', producto);
  }

  eliminarDelCarrito(productId: number): void {
    this.carrito = this.carrito.filter(item => item.id !== productId);
  }

  actualizarCantidad(productId: number, cambio: number): void {
    const item = this.carrito.find(i => i.id === productId);
    if (item) {
      if (cambio > 0 && item.quantity >= (item.stockActual || 0)) {
        Swal.fire({
          icon: 'warning',
          title: 'Stock Límite Alcanzado',
          text: `No puedes agregar más de ${item.stockActual} unidades para "${item.nombre}".`,
          confirmButtonColor: '#1d3976'
        });
        return;
      }
      item.quantity += cambio;
      if (item.quantity <= 0) {
        this.eliminarDelCarrito(productId);
      }
    }
  }

  obtenerTotal(): number {
    return this.carrito.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  }

  toggleCarrito(): void {
    this.carritoVisible = !this.carritoVisible;
  }

  // ===== CHECKOUT =====
  procederPago(): void {
    if (this.carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Tu carrito está vacío. Agrega productos para poder proceder al pago.',
        confirmButtonColor: '#1d3976'
      });
      return;
    }

    // Guardar en localStorage para la pasarela de pagos
    localStorage.setItem('checkoutCart', JSON.stringify(this.carrito));

    // Redirigir a pasarela de pagos
    this.router.navigate(['/pasarela-pagos']);
  }

  // ===== CARRUSEL =====
  iniciarCarrusel(): void {
    // Limpiar intervalo existente si hay uno
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }

    this.carouselInterval = setInterval(() => {
      this.siguienteSlide();
    }, 3000); // Cambiar slide cada 3 segundos
  }

  siguienteSlide(): void {
    this.slideActual = (this.slideActual + 1) % 3;
  }

  anteriorSlide(): void {
    this.slideActual = (this.slideActual - 1 + 3) % 3;
  }

  // ===== MODO OSCURO =====
  toggleModoOscuro(): void {
    this.themeService.toggleDarkMode();
  }

  irASlide(index: number): void {
    this.slideActual = index;
    // Reiniciar el auto-play al cambiar manualmente
    this.iniciarCarrusel();
  }

  // ===== FILTROS =====
  aplicarFiltros(): void {
    // Lógica de filtrado se implementaría aquí
    console.log('Filtros aplicados:', this.filtroCategoria, this.filtroOrden);
  }

  // ===== PERFIL =====
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Formatear precio
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
