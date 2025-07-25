import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimtoPage } from './simto.page';

describe('SimtoPage', () => {
  let component: SimtoPage;
  let fixture: ComponentFixture<SimtoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimtoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
