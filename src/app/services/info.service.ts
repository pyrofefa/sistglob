import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  private db!: SQLiteDBConnection;

  constructor() {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }

  async createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS perfil (
        user_id TEXT PRIMARY KEY,
        username TEXT,
        nombre TEXT,
        apellido_paterno TEXT,
        apellido_materno TEXT,
        junta_id INTEGER,
        estado_id INTEGER,
        junta_name TEXT,
        personal_id INTEGER,
        junta_sicafi_id INTEGER,
        email TEXT
      )
    `;
    await this.db.run(sql);
  }

  async saveProfile(
    user_id: any, username: any, nombre: any,
    apellido_paterno: any, apellido_materno: any,
    junta_id: any, estado_id:any, junta_name: any, personal_id: any,
    junta_sicafi_id: any, email: any
  ) {
    const sql = `
      INSERT INTO perfil (
        user_id, username, nombre, apellido_paterno, apellido_materno,
        junta_id, junta_name, personal_id, junta_sicafi_id, email
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await this.db.run(sql, [
      user_id, username, nombre, apellido_paterno,
      apellido_materno, junta_id, junta_name,
      personal_id, junta_sicafi_id, email
    ]);
  }

  async updateProfile(
    user_id: any, username: any, nombre: any,
    apellido_paterno: any, apellido_materno: any,
    junta_id: any, junta_name: any, personal_id: any,
    junta_sicafi_id: any, email: any
  ) {
    const sql = `
      UPDATE perfil SET
        username = ?, nombre = ?, apellido_paterno = ?, apellido_materno = ?,
        junta_id = ?, junta_name = ?, personal_id = ?, junta_sicafi_id = ?, email = ?
      WHERE user_id = ?
    `;
    await this.db.run(sql, [
      username, nombre, apellido_paterno, apellido_materno,
      junta_id, junta_name, personal_id, junta_sicafi_id, email, user_id
    ]);
  }

  async deleteProfile() {
    const tablas = ['perfil', 'simep', 'simgbn', 'simdia', 'simmoscas', 'simpp', 'simto', 'simto_detalle', 'simpicudo', 'simtrampeo', 'sqlite_sequence', 'error_logs' ];
    for (const tabla of tablas) {
      try {
        await this.db.run(`DELETE FROM ${tabla}`);
      } catch (err) {
        console.error(`Error eliminando tabla ${tabla}:`, err);
      }
    }
  }

  async getProfile() {
    try {
      const res = await this.db.query('SELECT * FROM perfil');
      return res.values || [];
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  }
}
