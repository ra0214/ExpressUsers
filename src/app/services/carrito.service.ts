import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { Carrito, CarritoItem, ResumenPedido, DatosCliente } from '../models/carrito.model';
import { SweetAlertService } from './sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carritoSubject = new BehaviorSubject<Carrito>({
    items: [],
    total: 0,
    cantidadItems: 0
  });

  private mostrarCarritoSubject = new BehaviorSubject<boolean>(false);
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sweetAlert: SweetAlertService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.cargarCarritoDelStorage();
    }
  }

  // Observables públicos
  get carrito$(): Observable<Carrito> {
    return this.carritoSubject.asObservable();
  }

  get mostrarCarrito$(): Observable<boolean> {
    return this.mostrarCarritoSubject.asObservable();
  }

  // Métodos para manejar el carrito
  agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
    const carritoActual = this.carritoSubject.value;
    const itemExistente = carritoActual.items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.producto.price;
      
      // Toast personalizado para producto existente
      this.sweetAlert.addToCartToast(`${producto.name} (Cantidad: ${itemExistente.cantidad})`);
    } else {
      const nuevoItem: CarritoItem = {
        producto,
        cantidad,
        subtotal: cantidad * producto.price
      };
      carritoActual.items.push(nuevoItem);
      
      // Toast personalizado para producto nuevo
      this.sweetAlert.addToCartToast(producto.name);
    }

    this.actualizarCarrito(carritoActual);
    this.guardarCarritoEnStorage();
  }

  eliminarDelCarrito(productoId: number): void {
    const carritoActual = this.carritoSubject.value;
    const itemEliminado = carritoActual.items.find(item => item.producto.id === productoId);
    
    if (itemEliminado) {
      carritoActual.items = carritoActual.items.filter(item => item.producto.id !== productoId);
      this.actualizarCarrito(carritoActual);
      this.guardarCarritoEnStorage();
      
      // Toast de confirmación de eliminación
      this.sweetAlert.success(`${itemEliminado.producto.name} eliminado`, '', 1500);
    }
  }

  actualizarCantidad(productoId: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminarDelCarrito(productoId);
      return;
    }

    const carritoActual = this.carritoSubject.value;
    const item = carritoActual.items.find(item => item.producto.id === productoId);
    
    if (item) {
      item.cantidad = cantidad;
      item.subtotal = cantidad * item.producto.price;
      this.actualizarCarrito(carritoActual);
      this.guardarCarritoEnStorage();
    }
  }

  vaciarCarrito(): void {
    this.sweetAlert.confirm(
      '¿Vaciar carrito?',
      'Esta acción eliminará todos los productos del carrito'
    ).then((result) => {
      if (result.isConfirmed) {
        const carritoVacio: Carrito = {
          items: [],
          total: 0,
          cantidadItems: 0
        };
        this.carritoSubject.next(carritoVacio);
        this.guardarCarritoEnStorage();
        
        this.sweetAlert.success('¡Carrito vaciado!', 'Todos los productos han sido eliminados', 1500);
      }
    });
  }

  // Métodos para mostrar/ocultar carrito
  abrirCarrito(): void {
    this.mostrarCarritoSubject.next(true);
  }

  cerrarCarrito(): void {
    this.mostrarCarritoSubject.next(false);
  }

  toggleCarrito(): void {
    this.mostrarCarritoSubject.next(!this.mostrarCarritoSubject.value);
  }

  // Método para generar resumen del pedido
  generarResumenPedido(datosCliente: DatosCliente, costoEnvio: number = 0): ResumenPedido {
    const carritoActual = this.carritoSubject.value;
    return {
      items: [...carritoActual.items],
      subtotal: carritoActual.total,
      envio: costoEnvio,
      total: carritoActual.total + costoEnvio,
      datosCliente
    };
  }

  // Método para enviar pedido por WhatsApp
  enviarPedidoPorWhatsApp(resumen: ResumenPedido, numeroWhatsApp: string = '529613677737'): void {
    if (!this.isBrowser) return;
    
    // Mostrar alerta de confirmación antes de enviar
    this.sweetAlert.confirm(
      '¿Enviar pedido por WhatsApp?',
      `Cliente: ${resumen.datosCliente.nombre} | Total: $${resumen.total.toFixed(2)}`
    ).then((result) => {
      if (result.isConfirmed) {
        // Mostrar loading mientras se prepara el mensaje
        this.sweetAlert.loading('Preparando pedido...', 'Generando mensaje de WhatsApp');
        
        setTimeout(() => {
          let mensaje = `🛒 *NUEVO PEDIDO - EXPRESS Arte*%0A%0A`;
          mensaje += `👤 *Cliente:* ${resumen.datosCliente.nombre}%0A`;
          mensaje += `📱 *Teléfono:* ${resumen.datosCliente.telefono}%0A`;
          mensaje += `📧 *Email:* ${resumen.datosCliente.email}%0A`;
          mensaje += `📍 *Dirección:* ${resumen.datosCliente.direccion}%0A%0A`;
          
          mensaje += `📦 *PRODUCTOS:*%0A`;
          resumen.items.forEach((item, index) => {
            mensaje += `${index + 1}. ${item.producto.name}%0A`;
            mensaje += `   Cantidad: ${item.cantidad}%0A`;
            mensaje += `   Precio unitario: $${item.producto.price.toFixed(2)}%0A`;
            mensaje += `   Subtotal: $${item.subtotal.toFixed(2)}%0A%0A`;
          });

          mensaje += `💰 *RESUMEN:*%0A`;
          mensaje += `Subtotal: $${resumen.subtotal.toFixed(2)}%0A`;
          if (resumen.envio > 0) {
            mensaje += `Envío: $${resumen.envio.toFixed(2)}%0A`;
          }
          mensaje += `*Total: $${resumen.total.toFixed(2)}*%0A%0A`;

          if (resumen.datosCliente.notas) {
            mensaje += `📝 *Notas adicionales:*%0A${resumen.datosCliente.notas}%0A%0A`;
          }

          mensaje += `¡Gracias por tu compra! 🎨✨`;

          const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
          window.open(enlaceWhatsApp, '_blank');
          
          // Cerrar loading y mostrar éxito
          this.sweetAlert.orderSent();
          
          // Vaciar carrito después del envío
          setTimeout(() => {
            const carritoVacio: Carrito = {
              items: [],
              total: 0,
              cantidadItems: 0
            };
            this.carritoSubject.next(carritoVacio);
            this.guardarCarritoEnStorage();
            this.cerrarCarrito();
          }, 2000);
        }, 1000);
      }
    });
  }

  // Métodos privados
  private actualizarCarrito(carrito: Carrito): void {
    carrito.total = carrito.items.reduce((total, item) => total + item.subtotal, 0);
    carrito.cantidadItems = carrito.items.reduce((total, item) => total + item.cantidad, 0);
    this.carritoSubject.next(carrito);
  }

  private guardarCarritoEnStorage(): void {
    if (!this.isBrowser) return;
    
    const carrito = this.carritoSubject.value;
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }

  private cargarCarritoDelStorage(): void {
    if (!this.isBrowser) return;
    
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        const carrito = JSON.parse(carritoGuardado);
        this.carritoSubject.next(carrito);
      } catch (error) {
        console.error('Error al cargar carrito del storage:', error);
      }
    }
  }
}
