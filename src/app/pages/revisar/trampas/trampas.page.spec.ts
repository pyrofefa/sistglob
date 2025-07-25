import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrampasPage } from './trampas.page';

describe('TrampasPage', () => {
  let component: TrampasPage;
  let fixture: ComponentFixture<TrampasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrampasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
