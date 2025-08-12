import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HomeData, HeroSection, CaracteristicaServicio, TestimonioCliente, CategoriaDestacada, EstadisticaNegocio } from '../models/home.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }

  getHomeData(): Observable<HomeData> {
    const homeData: HomeData = {
      hero: {
        titulo: 'EXPRESS Arte',
        subtitulo: 'Creatividad sin límites, calidad sin compromiso',
        descripcion: 'Descubre el mundo del arte y la creatividad con nuestra amplia selección de productos únicos. Desde pinturas personalizadas hasta regalos especiales, cada pieza cuenta una historia.',
        imagenFondo: 'assets/images/hero-bg.jpg',
        botonTexto: 'Explorar Productos',
        botonRuta: '/productos'
      },
      caracteristicas: [
        {
          icono: 'fas fa-palette',
          titulo: 'Arte Personalizado',
          descripcion: 'Creamos piezas únicas adaptadas a tus gustos y necesidades específicas.'
        },
        {
          icono: 'fas fa-shipping-fast',
          titulo: 'Envío Rápido',
          descripcion: 'Entrega segura y rápida en toda la ciudad.'
        },
        {
          icono: 'fas fa-heart',
          titulo: 'Hecho con Amor',
          descripcion: 'Cada producto es elaborado con cuidado y dedicación por artistas apasionados.'
        },
        {
          icono: 'fas fa-star',
          titulo: 'Calidad Premium',
          descripcion: 'Utilizamos solo los mejores materiales para garantizar durabilidad y belleza.'
        }
      ],
      categorias: [
        {
          id: 'pinturas',
          nombre: 'Pinturas',
          descripcion: 'Arte original y reproducciones de alta calidad',
          imagen: 'assets/images/categoria-pinturas.jpg',
          cantidadProductos: 25,
          ruta: '/productos?categoria=pinturas'
        },
        {
          id: 'regalos',
          nombre: 'Regalos Especiales',
          descripcion: 'Detalles únicos para ocasiones especiales',
          imagen: 'assets/images/categoria-regalos.jpg',
          cantidadProductos: 18,
          ruta: '/productos?categoria=regalos'
        },
        {
          id: 'ramos-dulces',
          nombre: 'Ramos de Dulces',
          descripcion: 'Dulces arreglos para endulzar cualquier momento',
          imagen: 'assets/images/categoria-ramos.jpg',
          cantidadProductos: 12,
          ruta: '/productos?categoria=ramos-dulces'
        },
        {
          id: 'manualidades',
          nombre: 'Manualidades',
          descripcion: 'Creaciones artesanales llenas de creatividad',
          imagen: 'assets/images/categoria-manualidades.jpg',
          cantidadProductos: 22,
          ruta: '/productos?categoria=manualidades'
        }
      ],
      testimonios: [
        {
          id: 1,
          nombre: 'María González',
          comentario: 'Increíble calidad en todos los productos. El ramo de dulces que pedí superó todas mis expectativas. ¡Totalmente recomendado!',
          rating: 5,
          avatar: 'assets/images/avatar-1.jpg',
          fecha: '2024-12-15'
        },
        {
          id: 2,
          nombre: 'Carlos Ruiz',
          comentario: 'El servicio es excepcional y la atención personalizada hace la diferencia. Mi pintura personalizada quedó perfecta.',
          rating: 5,
          avatar: 'assets/images/avatar-2.jpg',
          fecha: '2024-12-10'
        },
        {
          id: 3,
          nombre: 'Ana Martínez',
          comentario: 'Compré varios regalos para navidad y todos llegaron en perfecto estado. La calidad-precio es excelente.',
          rating: 5,
          avatar: 'assets/images/avatar-3.jpg',
          fecha: '2024-12-05'
        },
        {
          id: 4,
          nombre: 'Roberto Silva',
          comentario: 'Proceso de compra muy fácil y entrega súper rápida. Definitivamente volveré a comprar aquí.',
          rating: 4,
          avatar: 'assets/images/avatar-4.jpg',
          fecha: '2024-11-28'
        }
      ],
      estadisticas: [
        {
          numero: '500+',
          descripcion: 'Clientes Satisfechos',
          icono: 'fas fa-users'
        },
        {
          numero: '1000+',
          descripcion: 'Productos Creados',
          icono: 'fas fa-box'
        },
        {
          numero: '98%',
          descripcion: 'Satisfacción del Cliente',
          icono: 'fas fa-thumbs-up'
        },
        {
          numero: '24/7',
          descripcion: 'Atención al Cliente',
          icono: 'fas fa-clock'
        }
      ],
      sobreNosotros: {
        titulo: 'Nuestra Historia',
        descripcion: 'EXPRESS Arte nació de la pasión por crear belleza y compartir momentos especiales a través del arte. Somos un equipo de artistas y creativos dedicados a transformar ideas en realidades tangibles.',
        imagen: 'assets/logo.jpg',
        puntosClave: [
          'Más de 5 años de experiencia en el mercado',
          'Equipo de artistas profesionales y apasionados',
          'Compromiso con la calidad y la satisfacción del cliente',
          'Innovación constante en diseños y técnicas',
          'Responsabilidad social y ambiental'
        ]
      }
    };

    return of(homeData);
  }

  // Método para obtener solo las categorías destacadas
  getCategoriasDestacadas(): Observable<CategoriaDestacada[]> {
    return new Observable(observer => {
      this.getHomeData().subscribe(data => {
        observer.next(data.categorias);
        observer.complete();
      });
    });
  }

  // Método para obtener solo los testimonios
  getTestimonios(): Observable<TestimonioCliente[]> {
    return new Observable(observer => {
      this.getHomeData().subscribe(data => {
        observer.next(data.testimonios);
        observer.complete();
      });
    });
  }
}
