import { ErrorHandler, Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { MenuComponent } from './components/menu/menu.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { File } from '@awesome-cordova-plugins/file/ngx';
import { ErrorLoggerInterceptor } from './interceptors/error-logger.interceptor';
import * as Sentry from '@sentry/capacitor';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    Sentry.captureException(error);
    console.error(error); // Opcional: log en consola
  }
}

@NgModule({
  declarations: [AppComponent, MenuComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useClass: SentryErrorHandler },
    EmailComposer,
    File,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorLoggerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
