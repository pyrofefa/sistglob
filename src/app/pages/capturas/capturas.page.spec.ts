import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CapturasPage } from './capturas.page';

describe('CapturasPage', () => {
  let component: CapturasPage;
  let fixture: ComponentFixture<CapturasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CapturasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
