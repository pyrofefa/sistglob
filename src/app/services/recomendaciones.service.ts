import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class RecomendacionesService {
  private db: SQLiteDBConnection | null = null;

  constructor() {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }

  async createTable(): Promise<void> {
    const sql = `
        CREATE TABLE IF NOT EXISTS recomendaciones (
          id INTEGER,
          name TEXT,
          orden INTEGER,
          id_sicafi INTEGER,
          id_sicafison INTEGER,
          status INTEGER,
          campana_id INTEGER,
          created DATETIME,
          modified DATETIME
        );
      `;
    await this.db?.execute(sql);
  }

  async getRecomendaciones(sim: number): Promise<any[]> {
    const sql = `SELECT * FROM recomendaciones WHERE campana_id = ? AND status = 1 ORDER BY orden ASC`;
    const res = await this.db?.query(sql, [sim]);
    return res?.values ?? [];
  }

  async getRecomendacionesAll(): Promise<any[]> {
    const sql = `SELECT * FROM recomendaciones WHERE status = 1 ORDER BY campana_id, name ASC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
}
