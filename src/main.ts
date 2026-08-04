import { bootstrapApplication } from "@angular/platform-browser";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) =>
        console.log("Service Worker registered successfully:", reg.scope),
      )
      .catch((err) => console.warn("Service Worker registration failed:", err));
  });
}
