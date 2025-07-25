import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimdiaPage } from './simdia.page';

describe('SimdiaPage', () => {
  let component: SimdiaPage;
  let fixture: ComponentFixture<SimdiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimdiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
