import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorLogsDetailPage } from './error-logs-detail.page';

describe('ErrorLogsDetailPage', () => {
  let component: ErrorLogsDetailPage;
  let fixture: ComponentFixture<ErrorLogsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorLogsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
