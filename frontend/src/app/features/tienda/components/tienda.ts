import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { VeterinariasService } from '../../../core/services/veterinarias.service';
import { ProductosService } from '../../../core/services/productos.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { PreloaderComponent } from '../../../shared/components/preloader/preloader';

@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PreloaderComponent],
  templateUrl: './tienda.html',
  styleUrl: './tienda.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Tienda implements OnInit, OnDestroy {
  // Control de vistas: 'tiendas' | 'productos'
  vista: string = 'tiendas';
  baseUrl: string = environment.apiUrl;

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
    this.cdr.detectChanges();
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
        this.cdr.detectChanges();
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
        this.cdr.detectChanges();
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
    
    // Defer state change to avoid NG0100
    setTimeout(() => {
      this.cargandoProductos = true;
      this.vista = 'productos';
      this.cdr.detectChanges();
    });

    this.cargarProductosTienda(tienda.id);
    this.iniciarCarrusel();
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
        setTimeout(() => {
          this.cargandoProductos = false;
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('❌ Error al cargar productos:', error);
        this.productos = [];
        setTimeout(() => {
          this.cargandoProductos = false;
          this.cdr.detectChanges();
        });
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
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  async procederPago(): Promise<void> {
    if (this.carrito.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Tu carrito está vacío. Agrega productos para poder proceder al pago.',
        confirmButtonColor: '#1d3976'
      });
      return;
    }

    // Obtener información del usuario actual para pre-completar el formulario
    const fullName = this.currentUser?.fullName || `${this.currentUser?.firstName || ''} ${this.currentUser?.lastName || ''}`.trim() || '';
    const phone = this.currentUser?.phone || '';
    const address = this.currentUser?.address || '';
    const city = this.currentUser?.city || 'Duitama';

    const result = await Swal.fire({
      title: 'Información de Envío',
      html: `
        <div style="text-align: left; font-family: inherit;">
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px; font-size: 0.9rem; color: #333;">Nombre Completo:</label>
            <input id="swal-input-name" class="swal2-input" style="margin: 0; width: 100%; height: 38px; font-size: 0.9rem; border-radius: 6px; box-sizing: border-box;" value="${fullName}">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px; font-size: 0.9rem; color: #333;">Teléfono:</label>
            <input id="swal-input-phone" class="swal2-input" style="margin: 0; width: 100%; height: 38px; font-size: 0.9rem; border-radius: 6px; box-sizing: border-box;" value="${phone}">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px; font-size: 0.9rem; color: #333;">Dirección de Envío:</label>
            <input id="swal-input-address" class="swal2-input" style="margin: 0; width: 100%; height: 38px; font-size: 0.9rem; border-radius: 6px; box-sizing: border-box;" value="${address}">
          </div>
          <div style="margin-bottom: 12px;">
            <label style="font-weight: 600; display: block; margin-bottom: 4px; font-size: 0.9rem; color: #333;">Ciudad:</label>
            <input id="swal-input-city" class="swal2-input" style="margin: 0; width: 100%; height: 38px; font-size: 0.9rem; border-radius: 6px; box-sizing: border-box;" value="${city}">
          </div>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Proceder al Pago con Stripe',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1d3976',
      cancelButtonColor: '#d33',
      preConfirm: () => {
        const name = (document.getElementById('swal-input-name') as HTMLInputElement).value;
        const phoneVal = (document.getElementById('swal-input-phone') as HTMLInputElement).value;
        const addr = (document.getElementById('swal-input-address') as HTMLInputElement).value;
        const cty = (document.getElementById('swal-input-city') as HTMLInputElement).value;

        if (!name.trim() || !phoneVal.trim() || !addr.trim() || !cty.trim()) {
          Swal.showValidationMessage('Por favor completa todos los campos de envío.');
          return false;
        }
        return { fullName: name, phone: phoneVal, address: addr, city: cty };
      }
    });

    if (!result.isConfirmed || !result.value) {
      return;
    }

    this.cargandoProductos = true;
    const headers = this.getAuthHeaders();

    try {
      // Guardar el carrito local en checkoutCart de localStorage por compatibilidad
      localStorage.setItem('checkoutCart', JSON.stringify(this.carrito));

      // 1. Vaciar el carrito en la base de datos
      try {
        await lastValueFrom(
          this.http.delete(`${this.baseUrl}/carrito-productos/vaciar`, { headers })
        );
      } catch (err: any) {
        if (err.status !== 404) {
          throw err;
        }
      }

      // 2. Sincronizar productos locales con la base de datos
      for (const item of this.carrito) {
        const body = {
          productoId: item.id,
          cantidad: item.quantity
        };
        await lastValueFrom(
          this.http.post(`${this.baseUrl}/carrito-productos/agregar`, body, { headers })
        );
      }

      // 3. Crear sesión de checkout de Stripe
      const stripePayload = {
        items: this.carrito.map(item => ({
          name: item.nombre,
          price: item.precio,
          quantity: item.quantity
        })),
        shipping: result.value,
        paymentMethod: 'card',
        total: this.obtenerTotal()
      };

      const res = await lastValueFrom(
        this.http.post<any>(
          `${this.baseUrl}/stripe/create-checkout-session`, 
          stripePayload,
          { headers }
        )
      );

      setTimeout(() => {
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      });
      
      if (res && res.url) {
        window.location.href = res.url;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error de pasarela',
          text: 'No se pudo generar la sesión de pago con Stripe.',
          confirmButtonColor: '#1d3976'
        });
      }
    } catch (err: any) {
      setTimeout(() => {
        this.cargandoProductos = false;
        this.cdr.detectChanges();
      });
      console.error('Error al procesar pago/checkout:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de Procesamiento',
        text: err.error?.message || 'No se pudo validar el stock o procesar el pago en el servidor.',
        confirmButtonColor: '#1d3976'
      });
    }
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
    this.cdr.markForCheck();
  }

  anteriorSlide(): void {
    this.slideActual = (this.slideActual - 1 + 3) % 3;
    this.cdr.markForCheck();
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
