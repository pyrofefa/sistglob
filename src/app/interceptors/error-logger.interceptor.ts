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

@Injectable()
export class ErrorLoggerInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status >= 400) {
          Sentry.withScope(scope => {
            scope.setTag('http.method', req.method);
            scope.setTag('http.url', req.urlWithParams);
            scope.setTag('http.status', error.status.toString());
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
