import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  
  // Información de contacto y redes sociales
  socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/share/17ieejHR91/?mibextid=wwXIfr',
      icon: 'fab fa-facebook-f',
      color: '#1877f2'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/expressarte_tux?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
      icon: 'fab fa-instagram',
      color: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)'
    },
    {
      name: 'WhatsApp',
      url: 'https://wa.me/529613677737',
      icon: 'fab fa-whatsapp',
      color: 'linear-gradient(45deg, #25d366 0%, #128c7e 100%)'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@expressarte_tux?_t=ZS-8y8Rph4blgd&_r=1',
      icon: 'fab fa-tiktok',
      color: '#000000'
    }
  ];

  supportInfo = {
    email: 'soporte@expressarte.com',
    phone: '+52 961 216 5495',
    whatsapp: '529612165495'
  };

  // Método para abrir WhatsApp con mensaje predefinido
  contactSupport(): void {
    const mensaje = 'Hola! Necesito ayuda con la página web de EXPRESS Arte. ¿Podrían asistirme?';
    const mensajeCodificado = encodeURIComponent(mensaje);
    const enlaceWhatsApp = `https://wa.me/${this.supportInfo.whatsapp}?text=${mensajeCodificado}`;
    window.open(enlaceWhatsApp, '_blank');
  }

  // Método para abrir enlaces de redes sociales
  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }
}
