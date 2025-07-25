import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root',
})
export class SimtoDetalleService {
  private db: SQLiteDBConnection | null = null;

  constructor() {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }
  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS simto_detalle (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        id_simto interger,
        numero INTERGER,
        longitud REAL,
        latitud REAL,
        accuracy REAL,
        distancia_qr REAL,
        status INTERGER,
        captura INTERGER,
        id_bd_cel INTERGER
      );
      `;
    await this.db?.execute(sql);
  }
  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simto_detalle'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }

  async agregar(
    id: any,
    punto: any,
    captura: any,
    longitud: any,
    latitud: any,
    presicion: any,
    distancia_qr: any,
    id_bd_cel: any,
  ): Promise<boolean> {
    const sql = `
      INSERT INTO simto_detalle(
        id_simto,
        numero,
        longitud,
        latitud,
        accuracy,
        distancia_qr,
        status,
        captura,
        id_bd_cel
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      id,
      punto,
      longitud,
      latitud,
      presicion,
      distancia_qr,
      3,
      captura,
      id_bd_cel,
    ];
    try {
      await this.db?.run(sql, values);
      return true;
    } catch (error) {
      console.error('Error insertando detalle:', error);
      throw error; // o return false si prefieres no lanzar error
    }
  }

  async simto(id: number): Promise<any[]> {
    const sql = `SELECT * FROM simto_detalle WHERE id_simto = ?`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }
  async eliminar(id: any): Promise<boolean> {
    try {
      const sql = 'DELETE FROM simto_detalle WHERE id = ?';
      await this.db?.run(sql, [id]);
      return true;
    } catch (error) {
      console.error('Error al eliminar detalle:', error);
      throw error;
    }
  }


}
