import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import * as Sentry from '@sentry/capacitor';

/* ===========================================================
   Inicialización Sentry Capacitor
   - Captura errores JS y nativos
   - Almacena offline y los envía al reconectar
=========================================================== */
Sentry.init({
  dsn: 'https://865dcf0045207e6bc7587019a1995ccc@o4508484448092160.ingest.us.sentry.io/4509878350053376',
  beforeSend(event, hint) {
    if (
      event.message &&
      event.message.includes("Ionic Native: deviceready event fired")
    ) {
      return null; // Omitir este evento
    }
    return event;
  },
});

/* ===========================================================
   Sobrescribir console para capturar logs, warnings y errores
=========================================================== */
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

console.error = (...args: any[]) => {
  Sentry.captureException(new Error(args.join(' ')));
  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  Sentry.captureMessage(args.join(' '));
  originalConsoleWarn.apply(console, args);
};

console.log = (...args: any[]) => {
  Sentry.captureMessage(args.join(' '));
  originalConsoleLog.apply(console, args);
};

/* ===========================================================
   Bootstrapping de la app
=========================================================== */
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
