import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OmisionesPage } from './omisiones.page';

describe('OmisionesPage', () => {
  let component: OmisionesPage;
  let fixture: ComponentFixture<OmisionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OmisionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
