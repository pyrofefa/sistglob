import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservacionesPage } from './observaciones.page';

describe('ObservacionesPage', () => {
  let component: ObservacionesPage;
  let fixture: ComponentFixture<ObservacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
