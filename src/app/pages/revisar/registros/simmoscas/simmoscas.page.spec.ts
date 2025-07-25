import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimmoscasPage } from './simmoscas.page';

describe('SimmoscasPage', () => {
  let component: SimmoscasPage;
  let fixture: ComponentFixture<SimmoscasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimmoscasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
