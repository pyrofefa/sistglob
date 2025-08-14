import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { DatabaseInitService } from './services/database-init-service.service';
import { MigrationSessionService } from './services/migration-session.service';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';
import { ErrorLogService } from './services/error-log.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  session: any;
  constructor(
    private platform: Platform,
    private authenticationService: AuthenticationService,
    private router: Router,
    private databaseInit: DatabaseInitService,
    private migrationSession: MigrationSessionService,
    private logService: ErrorLogService,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    try {
      this.migrationSession.migrateSession();
      await this.platform.ready();
      await this.initCrashlytics();

      try {
        await this.databaseInit.initializeDatabase();
        console.log('🚀 Base de datos lista');
      } catch (err) {
        console.error('❌ Error al inicializar la base de datos:', err);
        await FirebaseCrashlytics.recordException({
          message: 'Error en inicialización de DB: ' + err,
        });
      }

      // Configurar StatusBar y SplashScreen modernos
      await StatusBar.setStyle({ style: Style.Default });
      await StatusBar.setOverlaysWebView({ overlay: false });
      // Forzar tema claro
      document.body.classList.toggle('dark', false);
      this.platform.is('android') || this.platform.is('ios')
        ? StatusBar.setStyle({ style: Style.Light })
        : null;

      // Captura de errores globales
      window.addEventListener('error', async (event) => {
        await this.logService.agregarLog({
          date: new Date().toISOString(),
          message: event.message || 'Error JS desconocido',
          detail: `${event.filename} : ${event.lineno}:${event.colno}`,
        });
      });

      // Captura de promesas no manejadas
      window.addEventListener(
        'unhandledrejection',
        async (event: PromiseRejectionEvent) => {
          await this.logService.agregarLog({
            date: new Date().toISOString(),
            message: 'Promise Rejection',
            detail: event.reason ? JSON.stringify(event.reason) : 'Sin detalle',
          });
        },
      );

      this.authenticationService.authenticationState.subscribe((state) => {
        this.session = state;
        if (state) {
          this.router.navigate(['home']);
        } else {
          this.router.navigate(['login']);
        }
      });
    } catch (err) {
      console.error('Error al inicializar la app:', err);
      await FirebaseCrashlytics.recordException({
        message: 'Error al inicializar la app: ' + err,
      });
    }
  }
  private async initCrashlytics() {
    try {
      // Habilitar Crashlytics
      await FirebaseCrashlytics.setEnabled({ enabled: true });

      //await FirebaseCrashlytics.setUserId({ userId: 'user123' });
      await FirebaseCrashlytics.log({ message: 'Crashlytics enabled' });
      console.log('Crashlytics inicializado correctamente');

      // Enviar una excepción de prueba
      /*await FirebaseCrashlytics.recordException({
        message: 'Test initialization exception',
      });*/
    } catch (err) {
      console.error('Error inicializando Crashlytics:', err);
    }
  }
}
