import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CarritoService } from '../services/carrito.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { Carrito, CarritoItem, DatosCliente } from '../models/carrito.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  carrito: Carrito = { items: [], total: 0, cantidadItems: 0 };
  mostrarCarrito = false;
  mostrandoCheckout = false;
  
  // Datos del cliente para el checkout
  datosCliente: DatosCliente = {
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    notas: ''
  };

  costoEnvio = 50; // Costo fijo de envío
  envioDomicilio = true;

  constructor(
    private carritoService: CarritoService,
    private sweetAlert: SweetAlertService
  ) {}

  ngOnInit(): void {
    this.carritoService.carrito$
      .pipe(takeUntil(this.destroy$))
      .subscribe(carrito => {
        this.carrito = carrito;
      });

    this.carritoService.mostrarCarrito$
      .pipe(takeUntil(this.destroy$))
      .subscribe(mostrar => {
        this.mostrarCarrito = mostrar;
        if (!mostrar) {
          this.mostrandoCheckout = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos para manejar el carrito
  actualizarCantidad(productoId: number, nuevaCantidad: number): void {
    this.carritoService.actualizarCantidad(productoId, nuevaCantidad);
  }

  eliminarItem(productoId: number): void {
    this.sweetAlert.confirm(
      '¿Eliminar producto?',
      'Este producto será removido del carrito'
    ).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarDelCarrito(productoId);
      }
    });
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
  }

  cerrarCarrito(): void {
    this.carritoService.cerrarCarrito();
  }

  // Métodos para el checkout
  iniciarCheckout(): void {
    this.mostrandoCheckout = true;
  }

  volver(): void {
    this.mostrandoCheckout = false;
  }

  procesarPedido(): void {
    if (!this.validarDatosCliente()) {
      return;
    }

    const costoEnvioFinal = this.envioDomicilio ? this.costoEnvio : 0;
    const resumen = this.carritoService.generarResumenPedido(this.datosCliente, costoEnvioFinal);
    
    // Enviar por WhatsApp (el servicio ya maneja las alertas)
    this.carritoService.enviarPedidoPorWhatsApp(resumen);
    
    // Resetear formulario
    this.resetearFormulario();
  }

  // Métodos auxiliares
  private validarDatosCliente(): boolean {
    if (!this.datosCliente.nombre.trim()) {
      this.sweetAlert.warning(
        'Nombre requerido',
        'Por favor ingresa tu nombre completo'
      );
      return false;
    }
    if (!this.datosCliente.telefono.trim()) {
      this.sweetAlert.warning(
        'Teléfono requerido',
        'Por favor ingresa tu número de teléfono'
      );
      return false;
    }
    if (!this.datosCliente.email.trim()) {
      this.sweetAlert.warning(
        'Email requerido',
        'Por favor ingresa tu dirección de email'
      );
      return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.datosCliente.email)) {
      this.sweetAlert.warning(
        'Email inválido',
        'Por favor ingresa un email válido (ejemplo@correo.com)'
      );
      return false;
    }
    
    if (this.envioDomicilio && !this.datosCliente.direccion.trim()) {
      this.sweetAlert.warning(
        'Dirección requerida',
        'Por favor ingresa tu dirección completa para el envío'
      );
      return false;
    }
    return true;
  }

  private resetearFormulario(): void {
    this.datosCliente = {
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      notas: ''
    };
    this.mostrandoCheckout = false;
  }

  get totalConEnvio(): number {
    return this.carrito.total + (this.envioDomicilio ? this.costoEnvio : 0);
  }

  // Método para manejar errores de imagen
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/images/placeholder.jpg';
    }
  }
}
