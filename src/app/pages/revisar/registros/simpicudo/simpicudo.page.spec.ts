import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpicudoPage } from './simpicudo.page';

describe('SimpicudoPage', () => {
  let component: SimpicudoPage;
  let fixture: ComponentFixture<SimpicudoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpicudoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
