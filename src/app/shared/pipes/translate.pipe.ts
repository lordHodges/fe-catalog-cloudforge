import { Pipe, PipeTransform, inject } from "@angular/core";
import { TranslationService } from "../../core/services/translation.service";

@Pipe({
  name: "translate",
  standalone: true,
  pure: false, // Impure to automatically update when signal changes in the service, though with signals we might need to rely on other mechanisms, but this works for a simple app
})
export class TranslatePipe implements PipeTransform {
  private translationService = inject(TranslationService);

  transform(key: string): string {
    return this.translationService.translate(key);
  }
}
