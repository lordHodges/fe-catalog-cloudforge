import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { CartDrawerComponent } from "./features/cart/ui/cart-drawer.component";
import { CartService } from "./core/cart.service";
import { SeoService } from "./core/services/seo.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    CartDrawerComponent,
  ],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App implements OnInit {
  title = "CloudForge Catalog";
  cartService = inject(CartService);
  private seoService = inject(SeoService);

  ngOnInit() {
    this.seoService.init();
    this.seoService.updateSeo({});
  }
}
