import { Injectable } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
}

@Injectable({
  providedIn: "root",
})
export class SeoService {
  private defaultTitle = "CloudForge Marketplace";
  private defaultDescription =
    "Find the best cloud development tools and services in the CloudForge Marketplace.";
  private defaultKeywords =
    "cloud, development, tools, marketplace, cloudforge";
  private defaultImage = "https://cloudforge.dev/assets/logo.png";

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
  ) {}

  init(): void {
    // Escuchar cambios de ruta para actualizar SEO genérico si es necesario,
    // o limpiar/resetear metas. Por ahora solo dejamos el hook.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        // Opcional: auto-actualizar basado en los datos de la ruta actual
      });
  }

  updateSeo(config: SeoConfig): void {
    const title = config.title
      ? `${config.title} | CloudForge`
      : this.defaultTitle;
    this.titleService.setTitle(title);

    this.metaService.updateTag({
      name: "description",
      content: config.description || this.defaultDescription,
    });
    this.metaService.updateTag({
      name: "keywords",
      content: config.keywords || this.defaultKeywords,
    });

    // Open Graph
    this.metaService.updateTag({ property: "og:title", content: title });
    this.metaService.updateTag({
      property: "og:description",
      content: config.description || this.defaultDescription,
    });
    if (config.image) {
      this.metaService.updateTag({
        property: "og:image",
        content: config.image,
      });
    } else {
      this.metaService.updateTag({
        property: "og:image",
        content: this.defaultImage,
      });
    }

    // Twitter Card
    this.metaService.updateTag({
      name: "twitter:card",
      content: "summary_large_image",
    });
    this.metaService.updateTag({ name: "twitter:title", content: title });
    this.metaService.updateTag({
      name: "twitter:description",
      content: config.description || this.defaultDescription,
    });
    if (config.image) {
      this.metaService.updateTag({
        name: "twitter:image",
        content: config.image,
      });
    } else {
      this.metaService.updateTag({
        name: "twitter:image",
        content: this.defaultImage,
      });
    }
  }
}
