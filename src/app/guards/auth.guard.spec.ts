import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { AuthenticationService } from '../services/authentication.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthenticationService', ['isAuthenticated']);
    guard = new AuthGuard(authService);
  });

  it('debería permitir el acceso si está autenticado', () => {
    authService.isAuthenticated.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });

  it('debería bloquear el acceso si NO está autenticado', () => {
    authService.isAuthenticated.and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
  });
});
