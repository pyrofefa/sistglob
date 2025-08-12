import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { StatusBar, Style } from '@capacitor/status-bar';
import { DatabaseInitService } from './services/database-init-service.service';
import { MigrationSessionService } from './services/migration-session.service';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

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
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    try {
      await FirebaseCrashlytics.setEnabled({ enabled: true });

      this.migrationSession.migrateSession();
      await this.platform.ready();
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
}
