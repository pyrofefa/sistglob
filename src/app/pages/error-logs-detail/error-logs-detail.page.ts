import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorLog, ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-error-logs-detail',
  templateUrl: './error-logs-detail.page.html',
  styleUrls: ['./error-logs-detail.page.scss'],
  standalone: false,
})
export class ErrorLogsDetailPage implements OnInit {
  log: ErrorLog | undefined;

  constructor(
    private route: ActivatedRoute,
    private logService: ErrorLogService
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      const logs = await this.logService.obtenerLogs();
      this.log = logs.find(l => l.id === id);
    }
  }
}
