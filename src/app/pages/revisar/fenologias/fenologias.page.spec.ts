import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FenologiasPage } from './fenologias.page';

describe('FenologiasPage', () => {
  let component: FenologiasPage;
  let fixture: ComponentFixture<FenologiasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FenologiasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
