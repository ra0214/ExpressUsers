import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { CarritoComponent } from './components/carrito.component';
import { CarritoBotonComponent } from './components/carrito-boton.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FooterComponent, CarritoComponent, CarritoBotonComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EXPRESS Arte';
}

