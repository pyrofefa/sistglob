import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrotesPage } from './brotes.page';

describe('BrotesPage', () => {
  let component: BrotesPage;
  let fixture: ComponentFixture<BrotesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BrotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
