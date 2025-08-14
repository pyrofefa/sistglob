import { Injectable } from '@angular/core';
import { CapacitorSQLite, SQLiteDBConnection } from '@capacitor-community/sqlite';

export interface ErrorLog {
  id?: number;
  date: string;
  message: string;
  detail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorLogService {
  private db!: SQLiteDBConnection;

  constructor() {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }

  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS error_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        message TEXT,
        detail TEXT );
      `;
    await this.db?.execute(sql);
  }

  async agregarLog(log: ErrorLog) {
    const query = `INSERT INTO error_logs (date, message, detail) VALUES (?, ?, ?)`;
    const values = [log.date, log.message, log.detail || ''];
    await this.db.run(query, values);
  }

  async obtenerLogs(): Promise<ErrorLog[]> {
    const query = `SELECT * FROM error_logs ORDER BY id DESC`;
    const res = await this.db.query(query);
    return res.values || [];
  }

  async borrarLog(id: number) {
    await this.db.run(`DELETE FROM error_logs WHERE id = ?`, [id]);
  }

  async limpiarLogs() {
    await this.db.run(`DELETE FROM error_logs`);
  }
}
