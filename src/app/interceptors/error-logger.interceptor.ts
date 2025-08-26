import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as Sentry from '@sentry/angular';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorLoggerInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 400) {
          // Si tienes el usuario en memoria, úsalo aquí. Si no, omite el await.
          let user: any = null;
          if (this.authService && typeof this.authService.getUser === 'function') {
            // Si getUser es síncrono, úsalo. Si es asíncrono, omite el usuario o usa una versión síncrona.
            // user = this.authService.getUserSync ? this.authService.getUserSync() : null;
          }

          Sentry.withScope(scope => {
            scope.setTag('http.method', req.method);
            scope.setTag('http.url', req.urlWithParams);
            scope.setTag('http.status', error.status.toString());
            if (user) {
              scope.setUser({
                id: user.id || user.user_id || '',
                username: user.username || '',
                email: user.email || ''
              });
            }
            scope.setExtra('request_body', req.body);
            scope.setExtra('response_body', error.error);
            scope.setExtra('error_message', error.message);
            Sentry.captureException(error);
          });
        }
        return throwError(() => error);
      })
    );
  }
}
