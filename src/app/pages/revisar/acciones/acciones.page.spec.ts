import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccionesPage } from './acciones.page';

describe('AccionesPage', () => {
  let component: AccionesPage;
  let fixture: ComponentFixture<AccionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
