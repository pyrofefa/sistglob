import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimgbnPage } from './simgbn.page';

describe('SimgbnPage', () => {
  let component: SimgbnPage;
  let fixture: ComponentFixture<SimgbnPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimgbnPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
