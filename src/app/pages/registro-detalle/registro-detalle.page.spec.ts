import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroDetallePage } from './registro-detalle.page';

describe('RegistroDetallePage', () => {
  let component: RegistroDetallePage;
  let fixture: ComponentFixture<RegistroDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
