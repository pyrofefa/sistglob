import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { ErrorLogService } from '../services/error-log.service';

@Injectable()
export class ErrorLoggerInterceptor implements HttpInterceptor {

  constructor(private logService: ErrorLogService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        const date = new Date().toISOString();
        const message = `HTTP ${error.status} - ${error.statusText}`;
        const detail = error.message || 'Error desconocido';

        // Usamos from() para manejar la promesa y seguir en el flujo Observable
        return from(
          this.logService.agregarLog({ date, message, detail })
        ).pipe(
          mergeMap(() => throwError(() => error))
        );
      })
    );
  }
}
