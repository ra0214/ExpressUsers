import { Routes } from '@angular/router';
import { HomeComponent } from './components/home.component';
import { ProductosComponent } from './components/productos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: '**', redirectTo: '' }
];
