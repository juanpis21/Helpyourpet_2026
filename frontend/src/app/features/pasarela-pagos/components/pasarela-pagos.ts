import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, lastValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { ThemeService } from '../../../core/services/theme.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-pasarela-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pasarela-pagos.html',
  styleUrl: './pasarela-pagos.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PasarelaPagos implements OnInit, OnDestroy {
  items: any[] = [];
  shippingCost: number = 5000;
  discount: number = 0;
  promoCode: string = '';
  selectedMethod: string = 'card';
  modoOscuro: boolean = false;
  showSuccessModal: boolean = false;
  showProcessingModal: boolean = false;
  orderNumber: string = '';

  // Form Fields
  shipping = {
    fullName: '',
    address: '',
    city: 'Duitama',
    phone: '',
  };

  card = {
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  };

  pse = {
    bank: '',
    personType: '',
    docNumber: '',
  };

  nequi = {
    phone: '',
  };

  private themeSub!: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarCarrito();
    this.cargarUsuario();

    // Sincronizar modo oscuro con ThemeService
    this.themeSub = this.themeService.darkMode$.subscribe(isDark => {
      this.modoOscuro = isDark;
      // Actualizar atributo data-theme en el body
      document.body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    });
  }

  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  cargarCarrito(): void {
    const cartData = localStorage.getItem('checkoutCart');
    if (cartData) {
      try {
        this.items = JSON.parse(cartData);
        // Si el carrito está vacío en checkout, redirigir a tienda
        if (this.items.length === 0) {
          this.router.navigate(['/tienda']);
        }
      } catch (error) {
        console.error('Error parsing checkout cart:', error);
        this.router.navigate(['/tienda']);
      }
    } else {
      this.router.navigate(['/tienda']);
    }
  }

  cargarUsuario(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.shipping.fullName = user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim();
      this.shipping.phone = user.phone || '';
      this.shipping.address = user.address || '';
    }
  }

  getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + (item.precio * item.quantity), 0);
  }

  getTotal(): number {
    const total = this.getSubtotal() + this.shippingCost - this.discount;
    return total < 0 ? 0 : total;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  selectPaymentMethod(method: string): void {
    this.selectedMethod = method;
  }

  toggleModoOscuro(): void {
    this.themeService.toggleDarkMode();
  }

  applyPromoCode(): void {
    const code = this.promoCode.trim().toUpperCase();
    if (!code) {
      Swal.fire({
        icon: 'warning',
        title: 'Código vacío',
        text: 'Por favor ingresa un código de descuento.',
        confirmButtonColor: '#018099'
      });
      return;
    }

    // Códigos promocionales simples de ejemplo
    if (code === 'PET10' || code === 'HELP10') {
      this.discount = Math.round(this.getSubtotal() * 0.10); // 10% descuento
      Swal.fire({
        icon: 'success',
        title: 'Código aplicado',
        text: 'Se ha aplicado un 10% de descuento a tu compra.',
        confirmButtonColor: '#018099'
      });
    } else if (code === 'ENVIOFREE') {
      this.discount = this.shippingCost; // Envío gratis
      Swal.fire({
        icon: 'success',
        title: 'Código aplicado',
        text: 'El costo de envío ahora es gratis.',
        confirmButtonColor: '#018099'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Código no válido',
        text: 'El código promocional ingresado no existe o ha expirado.',
        confirmButtonColor: '#018099'
      });
    }
  }

  cancelPayment(): void {
    Swal.fire({
      title: '¿Cancelar pago?',
      text: 'Se perderá el progreso de tu compra.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#018099',
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No, continuar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/tienda']);
      }
    });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  async syncCartWithBackend(): Promise<void> {
    const headers = this.getAuthHeaders();

    // 1. Vaciar el carrito de la base de datos
    try {
      await lastValueFrom(
        this.http.delete(`${environment.apiUrl}/carrito-productos/vaciar`, { headers })
      );
    } catch (err: any) {
      // Si el carrito no existe en BD (404), ignoramos el error ya que se creará uno nuevo al agregar
      if (err.status !== 404) {
        throw err;
      }
    }

    // 2. Agregar cada producto local al carrito de la base de datos
    for (const item of this.items) {
      const body = {
        productoId: item.id,
        cantidad: item.quantity
      };
      await lastValueFrom(
        this.http.post(`${environment.apiUrl}/carrito-productos/agregar`, body, { headers })
      );
    }
  }

  async processPayment(): Promise<void> {
    // Validar Datos de Envío
    if (!this.shipping.fullName.trim() || !this.shipping.address.trim() || !this.shipping.city.trim() || !this.shipping.phone.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Datos de envío incompletos',
        text: 'Por favor completa todos los campos de información de envío.',
        confirmButtonColor: '#018099'
      });
      return;
    }

    // Validar Datos según el método
    if (this.selectedMethod === 'card') {
      // Tarjeta / Stripe
    } else if (this.selectedMethod === 'pse') {
      if (!this.pse.bank || !this.pse.personType || !this.pse.docNumber.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Datos PSE incompletos',
          text: 'Por favor completa la información requerida para PSE.',
          confirmButtonColor: '#018099'
        });
        return;
      }
    } else if (this.selectedMethod === 'nequi') {
      if (!this.nequi.phone.trim()) {
        Swal.fire({
          icon: 'error',
          title: 'Celular Nequi requerido',
          text: 'Por favor ingresa tu número de celular registrado en Nequi.',
          confirmButtonColor: '#018099'
        });
        return;
      }
    }

    this.showProcessingModal = true;

    try {
      // 1. Sincronizar el carrito de LocalStorage al Carrito en Base de Datos
      await this.syncCartWithBackend();

      if (this.selectedMethod === 'card') {
        // 2. Checkout real con Stripe
        const stripePayload = {
          items: this.items.map(item => ({
            name: item.nombre,
            price: item.precio,
            quantity: item.quantity
          })),
          shipping: {
            fullName: this.shipping.fullName,
            address: this.shipping.address,
            city: this.shipping.city,
            phone: this.shipping.phone
          },
          paymentMethod: 'card',
          total: this.getTotal()
        };

        const res = await lastValueFrom(
          this.http.post<any>(
            `${environment.apiUrl}/stripe/create-checkout-session`, 
            stripePayload,
            { headers: this.getAuthHeaders() }
          )
        );

        this.showProcessingModal = false;
        if (res && res.url) {
          // Redirigir a la pasarela de Stripe segura
          window.location.href = res.url;
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error de pasarela',
            text: 'No se pudo generar la sesión de pago con Stripe.',
            confirmButtonColor: '#018099'
          });
        }

      } else {
        // 3. Checkout real para PSE / Nequi (descuenta stock de la base de datos)
        const checkoutPayload = {
          notas: `Pago simulado con ${this.selectedMethod.toUpperCase()}. Enviar a: ${this.shipping.address}, ${this.shipping.city}. Tel: ${this.shipping.phone}`
        };

        const venta = await lastValueFrom(
          this.http.post<any>(
            `${environment.apiUrl}/ventas/checkout`,
            checkoutPayload,
            { headers: this.getAuthHeaders() }
          )
        );

        this.showProcessingModal = false;
        this.orderNumber = '#' + venta.id;
        this.showSuccessModal = true;
        // Limpiar el carrito local
        localStorage.removeItem('checkoutCart');
      }

    } catch (err: any) {
      this.showProcessingModal = false;
      console.error('Error al procesar pago/checkout:', err);
      Swal.fire({
        icon: 'error',
        title: 'Error de Procesamiento',
        text: err.error?.message || 'No se pudo validar el stock o procesar el pago en el servidor.',
        confirmButtonColor: '#018099'
      });
    }
  }

  returnToStore(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/tienda']);
  }
}
