import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Producto, CategoriaProducto, FiltroProductos } from '../models/producto.model';
import { ProductoService } from '../services/producto.service';
import { CarritoService } from '../services/carrito.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { ComentariosService } from '../services/comentarios.service';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias = Object.values(CategoriaProducto);
  filtros: FiltroProductos = {};
  loading = false;
  error: string | null = null;
  wsConnected = false;
  
  // Número de WhatsApp (cambiar por el número real)
  private numeroWhatsApp = '529612165495'; // Formato: código país + número sin +
  
  // Variables para el formulario de filtros
  categoriaSeleccionada: string = '';
  precioMin: number | null = null;
  precioMax: number | null = null;
  busqueda: string = '';

  // Variables para comentarios
  mostrarComentarios = false;
  productoSeleccionado: Producto | null = null;
  comentarios: any[] = [];
  nuevoComentario = {
    comment: '',
    user_name: '',
    rating: 5,
    product_id: 0
  };
  cargandoComentarios = false;
  ratingHover = 0;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private sweetAlert: SweetAlertService,
    private comentariosService: ComentariosService,
    private webSocketService: WebSocketService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.cargarProductos();
    this.initWebSocket();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.webSocketService.disconnect();
  }

  private initWebSocket(): void {
    if (this.isBrowser) {
      // Conectar WebSocket
      this.webSocketService.connect();

      // Escuchar estado de conexión
      this.webSocketService.getConnectionStatus()
        .pipe(takeUntil(this.destroy$))
        .subscribe(connected => {
          this.wsConnected = connected;
          if (connected) {
            console.log('🔗 WebSocket conectado en Productos');
          }
        });

      // Escuchar actualizaciones de productos
      this.webSocketService.onProductUpdate()
        .pipe(takeUntil(this.destroy$))
        .subscribe(productData => {
          console.log('📦 Producto actualizado en tiempo real:', productData);
          this.cargarProductos(); // Recargar productos para reflejar cambios
          this.sweetAlert.success(
            'Producto actualizado',
            'Los productos han sido actualizados en tiempo real'
          );
        });

      // Escuchar nuevos comentarios
      this.webSocketService.onNewComment()
        .pipe(takeUntil(this.destroy$))
        .subscribe(commentData => {
          console.log('💬 Nuevo comentario recibido:', commentData);
          // Si estamos viendo comentarios del producto actualizado
          if (this.productoSeleccionado && commentData.product_id === this.productoSeleccionado.id) {
            this.cargarComentarios(this.productoSeleccionado.id);
          }
        });

      // Escuchar actualizaciones de inventario
      this.webSocketService.onInventoryUpdate()
        .pipe(takeUntil(this.destroy$))
        .subscribe(inventoryData => {
          console.log('📊 Inventario actualizado:', inventoryData);
          this.cargarProductos(); // Recargar para reflejar disponibilidad
        });
    }
  }

  cargarProductos(): void {
    this.loading = true;
    this.error = null;
    
    this.productoService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = productos;
        this.loading = false;
        
        if (productos.length === 0) {
          this.sweetAlert.info(
            'Sin productos',
            'No hay productos disponibles en este momento'
          );
        }
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'Error al cargar los productos. Por favor, asegúrate de que la API esté funcionando.';
        this.loading = false;
        
        this.sweetAlert.error(
          '¡Error al cargar productos!',
          'No se pudieron cargar los productos. Verifica la conexión y que la API esté funcionando.'
        ).then((result) => {
          if (result.isConfirmed) {
            this.cargarProductos();
          }
        });
      }
    });
  }

  aplicarFiltros(): void {
    this.filtros = {
      categoria: this.categoriaSeleccionada ? this.categoriaSeleccionada as CategoriaProducto : undefined,
      precioMin: this.precioMin || undefined,
      precioMax: this.precioMax || undefined,
      busqueda: this.busqueda || undefined
    };

    this.productoService.filtrarProductos(this.filtros).subscribe({
      next: (productos) => {
        this.productosFiltrados = productos;
        
        if (productos.length === 0) {
          this.sweetAlert.info(
            'Sin resultados',
            'No se encontraron productos con los filtros aplicados'
          );
        } else {
          this.sweetAlert.customSuccessToast(`${productos.length} producto(s) encontrado(s)`, '🔍');
        }
      },
      error: (error) => {
        console.error('Error al filtrar productos:', error);
        this.error = 'Error al filtrar productos.';
        
        this.sweetAlert.error(
          'Error al filtrar',
          'No se pudieron aplicar los filtros. Inténtalo de nuevo.'
        );
      }
    });
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada = '';
    this.precioMin = null;
    this.precioMax = null;
    this.busqueda = '';
    this.filtros = {};
    this.productosFiltrados = this.productos;
    
    this.sweetAlert.customSuccessToast('Filtros limpiados', '🔄');
  }

  getCategoriaLabel(categoria: string): string {
    const labels: { [key: string]: string } = {
      'pinturas': 'Pinturas',
      'regalos': 'Regalos',
      'ramos-dulces': 'Ramos de Dulces',
      'manualidades': 'Manualidades',
      'decoracion': 'Decoración',
      'electronica': 'Electrónica',
      'libros': 'Libros',
      'ropa': 'Ropa',
      'otros': 'Otros'
    };
    return labels[categoria] || categoria;
  }

  onImageError(event: any): void {
    event.target.src = 'assets/images/placeholder.jpg';
  }

  contactarPorWhatsApp(producto: Producto): void {
    this.sweetAlert.confirm(
      '¿Contactar por WhatsApp?',
      `¿Quieres consultar sobre "${producto.name}" por WhatsApp?`
    ).then((result) => {
      if (result.isConfirmed) {
        const mensaje = `Hola! Me interesa el producto "${producto.name}" (${this.getCategoriaLabel(producto.category)}) con precio de $${producto.price.toFixed(2)}. ¿Podrías darme más información?`;
        const mensajeCodificado = encodeURIComponent(mensaje);
        const enlaceWhatsApp = `https://wa.me/${this.numeroWhatsApp}?text=${mensajeCodificado}`;
        
        // Abrir WhatsApp en una nueva ventana/pestaña
        window.open(enlaceWhatsApp, '_blank');
        
        this.sweetAlert.customSuccessToast('¡Mensaje enviado!', '📱');
      }
    });
  }

  // Método para agregar producto al carrito
  agregarAlCarrito(producto: Producto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    if (producto.disponible === false) {
      this.sweetAlert.warning(
        'Producto no disponible',
        'Este producto no está disponible en este momento'
      );
      return;
    }

    // El CarritoService ya maneja las alertas para agregar productos
    this.carritoService.agregarAlCarrito(producto, 1);
  }

  private mostrarMensajeCarrito(nombreProducto: string): void {
    // Ya no necesitamos este método porque el CarritoService maneja las alertas
  }

  // Método para refrescar los productos
  refrescarProductos(): void {
    this.sweetAlert.loading('Actualizando productos...', 'Cargando los productos más recientes');
    
    setTimeout(() => {
      this.cargarProductos();
    }, 500);
  }

  // Métodos para comentarios
  verComentarios(producto: Producto, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    
    this.productoSeleccionado = producto;
    this.mostrarComentarios = true;
    this.nuevoComentario.product_id = producto.id;
    this.cargarComentarios(producto.id);
    
    // Hacer scroll suave a la sección de comentarios
    setTimeout(() => {
      const comentariosSection = document.getElementById('comentarios-section');
      if (comentariosSection) {
        comentariosSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 150);
  }

  cargarComentarios(productId: number): void {
    this.cargandoComentarios = true;
    
    this.comentariosService.getComentariosPorProducto(productId).subscribe({
      next: (response) => {
        this.comentarios = response.data || [];
        this.cargandoComentarios = false;
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
        this.comentarios = [];
        this.cargandoComentarios = false;
        this.sweetAlert.error('Error', 'No se pudieron cargar los comentarios');
      }
    });
  }

  agregarComentario(): void {
    if (!this.nuevoComentario.comment.trim() || !this.nuevoComentario.user_name.trim()) {
      this.sweetAlert.warning('Campos requeridos', 'Por favor completa todos los campos');
      return;
    }

    this.comentariosService.agregarComentario(this.nuevoComentario).subscribe({
      next: (response) => {
        this.sweetAlert.success('¡Comentario agregado!', 'Tu comentario ha sido publicado exitosamente');
        this.nuevoComentario.comment = '';
        this.nuevoComentario.user_name = '';
        this.nuevoComentario.rating = 5;
        
        // Recargar comentarios
        if (this.productoSeleccionado) {
          this.cargarComentarios(this.productoSeleccionado.id);
        }
      },
      error: (error) => {
        console.error('Error al agregar comentario:', error);
        this.sweetAlert.error('Error', 'No se pudo agregar el comentario');
      }
    });
  }

  cerrarComentarios(): void {
    this.mostrarComentarios = false;
    this.productoSeleccionado = null;
    this.comentarios = [];
    this.nuevoComentario = {
      comment: '',
      user_name: '',
      rating: 5,
      product_id: 0
    };
    
    // Hacer scroll suave de vuelta a la sección de productos
    setTimeout(() => {
      const productosSection = document.getElementById('productos-section');
      if (productosSection) {
        productosSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 150);
  }

  generarEstrellas(rating: number): string[] {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= rating ? '★' : '☆');
    }
    return estrellas;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Métodos para estadísticas de comentarios
  calcularPromedioRating(): number {
    if (this.comentarios.length === 0) return 0;
    const suma = this.comentarios.reduce((acc, comentario) => acc + comentario.rating, 0);
    return suma / this.comentarios.length;
  }

  contarRating(rating: number): number {
    return this.comentarios.filter(comentario => comentario.rating === rating).length;
  }

  calcularPorcentajeRating(rating: number): number {
    if (this.comentarios.length === 0) return 0;
    const count = this.contarRating(rating);
    return (count / this.comentarios.length) * 100;
  }

  // Métodos para selector de estrellas interactivo
  seleccionarRating(rating: number): void {
    this.nuevoComentario.rating = rating;
  }

  obtenerTextoRating(rating: number): string {
    const textos = {
      1: 'Muy malo',
      2: 'Malo',
      3: 'Regular',
      4: 'Bueno',
      5: 'Excelente'
    };
    return textos[rating as keyof typeof textos] || 'Sin calificar';
  }

  limpiarFormulario(): void {
    this.nuevoComentario = {
      comment: '',
      user_name: '',
      rating: 5,
      product_id: this.productoSeleccionado?.id || 0
    };
    this.ratingHover = 0;
  }
}
