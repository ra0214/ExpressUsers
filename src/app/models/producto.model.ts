export interface Producto {
  id: number;
  name: string;        
  description: string; 
  price: number;       
  category: string;    
  image_url?: string;   // Campo de imagen de la API
  disponible?: boolean; // Opcional
  fechaCreacion?: Date; // Opcional
}

export enum CategoriaProducto {
  PINTURAS = 'pinturas',
  REGALOS = 'regalos',
  RAMOS_DULCES = 'ramos-dulces',
  MANUALIDADES = 'manualidades',
  DECORACION = 'decoracion',
  ELECTRONICA = 'electronica',
  LIBROS = 'libros',
  ROPA = 'ropa',
  OTROS = 'otros'
}

export interface FiltroProductos {
  categoria?: CategoriaProducto;
  precioMin?: number;
  precioMax?: number;
  busqueda?: string;
}

// Interfaz para crear productos (enviar a la API)
export interface CreateProducto {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}
