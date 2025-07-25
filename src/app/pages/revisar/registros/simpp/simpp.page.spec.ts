import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimppPage } from './simpp.page';

describe('SimppPage', () => {
  let component: SimppPage;
  let fixture: ComponentFixture<SimppPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
