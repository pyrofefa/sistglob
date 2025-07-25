import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimepPage } from './simep.page';

describe('SimepPage', () => {
  let component: SimepPage;
  let fixture: ComponentFixture<SimepPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
