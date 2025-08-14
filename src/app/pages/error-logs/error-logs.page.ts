import { Component, OnInit } from '@angular/core';
import { ErrorLog, ErrorLogService } from 'src/app/services/error-log.service';

@Component({
  selector: 'app-error-logs',
  templateUrl: './error-logs.page.html',
  styleUrls: ['./error-logs.page.scss'],
  standalone: false
})
export class ErrorLogsPage implements OnInit {
  logs: ErrorLog[] = [];

  constructor(private logService: ErrorLogService) {}

  async ngOnInit() {
    await this.cargarLogs();
  }

  async cargarLogs() {
    this.logs = await this.logService.obtenerLogs();
  }

  async borrarLog(id: number) {
    await this.logService.borrarLog(id);
    await this.cargarLogs();
  }

  async limpiarLogs() {
    await this.logService.limpiarLogs();
    this.logs = [];
  }

  // 🔹 Solo para prueba: agregar error manual
  async agregarErrorDemo() {
    await this.logService.agregarLog({
      date: new Date().toISOString(),
      message: 'Error de prueba',
      detail: 'Este es un error generado para pruebas'
    });
    await this.cargarLogs();
  }
}
