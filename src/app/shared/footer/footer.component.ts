import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  template: `
    <footer class="footer mt-auto py-4 border-top border-purple">
      <div class="container text-center">
        <div
          class="d-flex justify-content-center align-items-center gap-2 mb-2"
        >
          <i class="bi bi-lightning-charge-fill text-cyan fs-5 brand-icon"></i>
          <span class="fw-bold text-light fs-5 brand-text"
            >CloudForge Marketplace</span
          >
        </div>
        <p class="text-secondary small mb-0">
          &copy; {{ currentYear }} CloudForge Inc. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      footer {
        background: rgba(13, 11, 24, 0.96);
        border-top: 1px solid rgba(157, 78, 221, 0.35) !important;
        backdrop-filter: blur(12px);
      }
      .brand-icon {
        filter: drop-shadow(0 0 6px #00e5ff);
      }
      .brand-text {
        background: linear-gradient(135deg, #ffffff 0%, #00e5ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .text-cyan {
        color: #00e5ff;
      }
      .text-secondary {
        color: #a0a5ba !important;
      }
    `,
  ],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
