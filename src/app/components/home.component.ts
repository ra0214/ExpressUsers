import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HomeService } from '../services/home.service';
import { CarritoService } from '../services/carrito.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { ComentariosService } from '../services/comentarios.service';
import { WebSocketService } from '../services/websocket.service';
import { HomeData, TestimonioCliente, CategoriaDestacada } from '../models/home.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  homeData: HomeData | null = null;
  loading = true;
  currentTestimonioIndex = 0;
  testimonioInterval: any;
  comentariosReales: any[] = [];
  loadingComentarios = false;

  // Variables para animaciones y efectos
  contadorAnimado = false;
  estadisticasVisibles = false;
  wsConnected = false;

  constructor(
    private homeService: HomeService,
    private carritoService: CarritoService,
    private sweetAlert: SweetAlertService,
    private comentariosService: ComentariosService,
    private webSocketService: WebSocketService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.cargarDatosHome();
    this.cargarComentariosReales();
    this.iniciarCarruselTestimonios();
    this.initWebSocket();
    
    if (this.isBrowser) {
      this.configurarAnimacionesScroll();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.webSocketService.disconnect();
    
    if (this.testimonioInterval) {
      clearInterval(this.testimonioInterval);
    }
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
            console.log('🔗 WebSocket conectado en Home');
          }
        });

      // Escuchar actualizaciones de productos
      this.webSocketService.onProductUpdate()
        .pipe(takeUntil(this.destroy$))
        .subscribe(productData => {
          console.log('📦 Producto actualizado en tiempo real:', productData);
          this.cargarDatosHome(); // Recargar datos para reflejar cambios
        });

      // Escuchar nuevos comentarios
      this.webSocketService.onNewComment()
        .pipe(takeUntil(this.destroy$))
        .subscribe(commentData => {
          console.log('💬 Nuevo comentario recibido:', commentData);
          this.cargarComentariosReales(); // Recargar comentarios
          this.sweetAlert.success(
            'Nuevo comentario',
            'Se ha agregado un nuevo comentario'
          );
        });

      // Escuchar actualizaciones de inventario
      this.webSocketService.onInventoryUpdate()
        .pipe(takeUntil(this.destroy$))
        .subscribe(inventoryData => {
          console.log('📊 Inventario actualizado:', inventoryData);
          this.cargarDatosHome(); // Recargar datos
        });
    }
  }

  cargarDatosHome(): void {
    this.homeService.getHomeData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.homeData = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar datos del home:', error);
          this.loading = false;
          this.sweetAlert.error(
            'Error al cargar',
            'No se pudieron cargar los datos de la página principal'
          );
        }
      });
  }

  cargarComentariosReales(): void {
    this.loadingComentarios = true;
    
    // Crear un servicio para obtener todos los comentarios
    this.comentariosService.getAllComentarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.comentariosReales = response.data || [];
          this.loadingComentarios = false;
        },
        error: (error: any) => {
          console.error('Error al cargar comentarios:', error);
          this.comentariosReales = [];
          this.loadingComentarios = false;
        }
      });
  }

  private iniciarCarruselTestimonios(): void {
    if (this.isBrowser) {
      this.testimonioInterval = setInterval(() => {
        this.siguienteTestimonio();
      }, 5000);
    }
  }

  private configurarAnimacionesScroll(): void {
    if (!this.isBrowser) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('estadisticas-section')) {
            this.estadisticasVisibles = true;
            this.animarContadores();
          }
        }
      });
    }, { threshold: 0.5 });

    // Observar elementos cuando se cargen los datos
    setTimeout(() => {
      const estadisticasEl = document.querySelector('.estadisticas-section');
      if (estadisticasEl) {
        observer.observe(estadisticasEl);
      }
    }, 100);
  }

  private animarContadores(): void {
    if (this.contadorAnimado || !this.homeData) return;
    
    this.contadorAnimado = true;
    const contadores = document.querySelectorAll('.contador-numero');
    
    contadores.forEach((contador, index) => {
      const target = this.homeData!.estadisticas[index].numero;
      const isPercentage = target.includes('%');
      const isPlus = target.includes('+');
      const targetNum = parseInt(target.replace(/[^0-9]/g, ''));
      
      let current = 0;
      const increment = targetNum / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          current = targetNum;
          clearInterval(timer);
        }
        
        let displayValue = Math.floor(current).toString();
        if (isPercentage) displayValue += '%';
        if (isPlus) displayValue += '+';
        
        contador.textContent = displayValue;
      }, 40);
    });
  }

  // Métodos para el carrusel de testimonios
  siguienteTestimonio(): void {
    const totalTestimonios = this.getTotalTestimonios();
    if (totalTestimonios === 0) return;
    
    this.currentTestimonioIndex = 
      (this.currentTestimonioIndex + 1) % totalTestimonios;
  }

  testimonioAnterior(): void {
    const totalTestimonios = this.getTotalTestimonios();
    if (totalTestimonios === 0) return;
    
    this.currentTestimonioIndex = 
      this.currentTestimonioIndex === 0 
        ? totalTestimonios - 1 
        : this.currentTestimonioIndex - 1;
  }

  irATestimonio(index: number): void {
    this.currentTestimonioIndex = index;
  }

  // Métodos para manejar comentarios reales
  getTotalTestimonios(): number {
    if (this.comentariosReales.length > 0) {
      return this.comentariosReales.length;
    }
    return this.homeData?.testimonios?.length || 0;
  }

  getCurrentTestimonio(): any {
    if (this.comentariosReales.length > 0) {
      return this.comentariosReales[this.currentTestimonioIndex];
    }
    return this.homeData?.testimonios?.[this.currentTestimonioIndex];
  }

  formatearFechaComentario(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  generarEstrellas(rating: number): string[] {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(i <= rating ? '★' : '☆');
    }
    return estrellas;
  }

  // Métodos de navegación
  navegarAProductos(): void {
    this.router.navigate(['/productos']);
  }

  navegarACategoria(categoria: CategoriaDestacada): void {
    this.router.navigate(['/productos'], { 
      queryParams: { categoria: categoria.id } 
    });
  }

  contactarWhatsApp(): void {
    this.sweetAlert.confirm(
      '¿Contactar por WhatsApp?',
      '¿Te gustaría hablar con nuestro equipo de atención al cliente?'
    ).then((result) => {
      if (result.isConfirmed) {
        const mensaje = '¡Hola! Me interesa conocer más sobre EXPRESS Arte y sus productos.';
        const mensajeCodificado = encodeURIComponent(mensaje);
        const enlaceWhatsApp = `https://wa.me/529612165495?text=${mensajeCodificado}`;
        
        if (this.isBrowser) {
          window.open(enlaceWhatsApp, '_blank');
        }
        
        this.sweetAlert.success(
          '¡Mensaje enviado!',
          'Se abrió WhatsApp con tu consulta'
        );
      }
    });
  }

  // Métodos para manejar errores de imagen
  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.src = 'assets/logo.jpg';
    }
  }

  // Método para generar estrellas de rating
  getStars(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  // Método para scroll suave
  scrollToSection(sectionId: string): void {
    if (!this.isBrowser) return;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
}
