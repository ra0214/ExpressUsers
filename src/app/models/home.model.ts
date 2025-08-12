export interface HomeData {
  hero: HeroSection;
  caracteristicas: CaracteristicaServicio[];
  categorias: CategoriaDestacada[];
  testimonios: TestimonioCliente[];
  estadisticas: EstadisticaNegocio[];
  sobreNosotros: SobreNosotrosSection;
}

export interface HeroSection {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagenFondo: string;
  botonTexto: string;
  botonRuta: string;
}

export interface CaracteristicaServicio {
  icono: string;
  titulo: string;
  descripcion: string;
}

export interface TestimonioCliente {
  id: number;
  nombre: string;
  comentario: string;
  rating: number;
  avatar: string;
  fecha: string;
}

export interface CategoriaDestacada {
  id: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  cantidadProductos: number;
  ruta: string;
}

export interface EstadisticaNegocio {
  numero: string;
  descripcion: string;
  icono: string;
}

export interface SobreNosotrosSection {
  titulo: string;
  descripcion: string;
  imagen: string;
  puntosClave: string[];
}
