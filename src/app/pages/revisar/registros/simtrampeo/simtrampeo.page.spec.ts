import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimtrampeoPage } from './simtrampeo.page';

describe('SimtrampeoPage', () => {
  let component: SimtrampeoPage;
  let fixture: ComponentFixture<SimtrampeoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimtrampeoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
