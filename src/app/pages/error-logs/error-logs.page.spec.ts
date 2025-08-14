import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorLogsPage } from './error-logs.page';

describe('ErrorLogsPage', () => {
  let component: ErrorLogsPage;
  let fixture: ComponentFixture<ErrorLogsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorLogsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
