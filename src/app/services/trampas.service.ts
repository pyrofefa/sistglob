import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class TrampasService {
  private db: SQLiteDBConnection | null = null;
  readonly ubicaciones$ = new EventEmitter<string>();

  constructor() {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }
  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS trampas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_bit INT,
      name TEXT,
      status INT,
      latitud REAL,
      longitud REAL,
      superficie INT,
      id_sicafi INTERGER,
      campo TEXT,
      productor TEXT,
      variedad_id INT,
      campana_id INT
    );
    `;
    await this.db?.execute(sql);
  }
  async getTrampas(sims: number): Promise<any[]> {
    if (!this.db) throw new Error('Base de datos no inicializada');
    const sql = `SELECT * FROM trampas WHERE campana_id = ? AND status = 1 ORDER BY name ASC`;
    const res = await this.db?.query(sql, [sims]);
    return res.values ?? [];
  }
  async getTrampasAll(): Promise<any[]> {
    if (!this.db) throw new Error('Base de datos no inicializada');
    const res = await this.db.query(
      'SELECT * FROM trampas ORDER BY campana_id, name ASC',
    );
    return res.values ?? [];
  }
  async getTrampaid(sims:number, id: number): Promise<any[] | null> {
    if (!this.db) throw new Error('Base de datos no inicializada');
    const sql = `
      SELECT *
      FROM trampas
      WHERE campana_id = ?
      AND id_bit = ?
      ORDER BY name ASC
    `;
    const res = await this.db.query(sql, [sims, id]);
    return res.values?.length ? res.values : null;
  }
  async calculateDistance(
    id: any,
  ): Promise<{ latitud: number; longitud: number } | null> {
    const sql = 'SELECT latitud, longitud FROM trampas WHERE id_bit = ?';
    try {
      const res = await this.db?.query(sql, [id]);
      if (res?.values && res.values.length > 0) {
        const item = res.values[0];
        return {
          latitud: item.latitud,
          longitud: item.longitud,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error en calculateDistance service:', error);
      throw error;
    }
  }
}
