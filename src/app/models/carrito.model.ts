import { Producto } from './producto.model';

export interface CarritoItem {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

export interface Carrito {
  items: CarritoItem[];
  total: number;
  cantidadItems: number;
}

export interface ResumenPedido {
  items: CarritoItem[];
  subtotal: number;
  envio: number;
  total: number;
  datosCliente: DatosCliente;
}

export interface DatosCliente {
  nombre: string;
  telefono: string;
  email: string;
  direccion: string;
  notas?: string;
}
