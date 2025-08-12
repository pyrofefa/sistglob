import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {
  buildInserPayloads,
  buildInsertInstallPayloads,
  buildUpdatePayloads,
  buildUpdatePayloadsInstalacion,
  CapturaSimtrampeo,
} from '../interfaces/captura-simtrampeo';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class SimtrampeoService {
  private db: SQLiteDBConnection | null = null;
  capturas$ = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }
  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS simtrampeo (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        junta_id TEXT,
        personal_id TEXT,
        user_id TEXT,
        fecha TEXT,
        fechaHora TEXT,
        longitud_ins REAL,
        latitud_ins REAL,
        longitud_rev REAL,
        latitud_rev REAL,
        accuracy REAL,
        distancia_qr REAL,
        status INTERGER,
        trampa_id INTERGER,
        fecha_instalacion TEXT,
        captura INTERGER,
        ano TEXT,
        semana TEXT,
        id_bd_cel INTERGER,
        siembra_id INTERGER
      );
      `;
    await this.db?.execute(sql);
  }
  async conteo(): Promise<any[]> {
    const sql = `SELECT * FROM simtrampeo WHERE status = 2`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }

  async capturaId(id: number): Promise<any[]> {
    const sql = `SELECT * FROM simtrampeo WHERE trampa_id = ? AND status = 3`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async capturaIdFinal(id: number, fecha: any): Promise<any[]> {
    const sql = `SELECT * FROM simtrampeo WHERE trampa_id = ? AND fecha = ?`;
    const res = await this.db?.query(sql, [id, fecha]);
    return res?.values ?? [];
  }

  async getCapturas(): Promise<any[]> {
    const sql = `SELECT trampas.variedad_id as instalada, simtrampeo.id, simtrampeo.user_id, simtrampeo.fecha, simtrampeo.fechaHora, simtrampeo.fecha_instalacion, simtrampeo.longitud_rev, simtrampeo.latitud_rev, simtrampeo.accuracy, simtrampeo.distancia_qr, simtrampeo.status, simtrampeo.trampa_id, simtrampeo.captura, trampas.name FROM simtrampeo INNER JOIN trampas ON simtrampeo.trampa_id = trampas.id_bit WHERE simtrampeo.status IN (1,2,3) AND trampas.campana_id = 3  ORDER BY datetime(simtrampeo.fechaHora) DESC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async getBuscar(fecha: any): Promise<any[]> {
    const sql = `SELECT simtrampeo.id, simtrampeo.user_id, simtrampeo.fecha, simtrampeo.fechaHora, simtrampeo.longitud_rev, simtrampeo.latitud_rev, simtrampeo.accuracy, simtrampeo.distancia_qr, simtrampeo.status, simtrampeo.trampa_id, simtrampeo.captura, trampas.name FROM simtrampeo INNER JOIN trampas ON simtrampeo.trampa_id = trampas.id_bit WHERE trampas.campana_id = 3 AND simtrampeo.fecha = ? ORDER BY datetime(simtrampeo.fechaHora) DESC`;
    const res = await this.db?.query(sql, [fecha]);
    return res?.values ?? [];
  }

  async getCapturaId(id: number): Promise<any[]> {
    const sql = `SELECT trampas.name as trampa, simtrampeo.feromona, simtrampeo.id, simtrampeo.siembra_id, simtrampeo.longitud_ins, simtrampeo.latitud_ins, simtrampeo.longitud_rev, simtrampeo.latitud_rev, simtrampeo.accuracy, simtrampeo.fecha_instalacion, simtrampeo.captura, simtrampeo.fechaHora, simtrampeo.fecha,  trampas.latitud, trampas.longitud, trampas.campo FROM trampas INNER JOIN simtrampeo ON simtrampeo.trampa_id = trampas.id_bit WHERE simtrampeo.id = ? LIMIT 1`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async delete(id: number): Promise<boolean> {
    const sql = `UPDATE simtrampeo SET status = 5 WHERE id = ?`;
    const res = await this.db?.run(sql, [id]);

    if (res?.changes?.changes && res.changes.changes > 0) {
      return true;
    } else {
      return false;
    }
  }

  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simtrampeo'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }
  async subir(): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simtrampeo';
    try {
      const query = 'SELECT * FROM simtrampeo WHERE status = 2 ORDER BY id ASC';
      const res = await this.db?.query(query);

      const capturas = res?.values ?? [];

      for (const captura of capturas) {
        const params: any = {
          id: captura.id_bit,
          trampa_id: captura.trampa_id,
          fecha: captura.fecha,
          semana: captura.semana,
          ano: captura.ano,
          latitud_ins: captura.latitud_ins,
          longitud_ins: captura.longitud_ins,
          latitud_rev: captura.latitud_rev,
          longitud_rev: captura.longitud_rev,
          accuracy: captura.accuracy,
          distancia_qr: captura.distancia_qr,
          fecha_instalacion: captura.fecha_instalacion,
          captura: captura.captura,
          method: 1,
          user_id: captura.user_id,
          personal_id: captura.personal_id,
          junta_id: captura.junta_id,
          id_bd_cel: captura.id_bd_cel,
          fechaHora_cel: captura.fechaHora,
          status: captura.status,
          version: captura.version,
          tipo: 'Subir datos',
        };

        try {
          const response: any = await lastValueFrom(
            this.http.post(url, params),
          );
          if (response.status === 'success' || response.status === 'warning') {
            const updateSQL = 'UPDATE simtrampeo SET status = 1 WHERE id = ?';
            await this.db?.run(updateSQL, [captura.id]);
          }
        } catch (httpError) {
          console.error('Error al enviar captura:', httpError);
          // puedes optar por continuar con las demás o lanzar error según la lógica deseada
        }
      }
      return { status: 'success', message: 'Capturas subidas correctamente' };
    } catch (dbError) {
      console.error('Error al leer de la base de datos:', dbError);
      throw dbError;
    }
  }
  async instalacion(data: CapturaSimtrampeo): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simtrampeo';
    const { params, values } = buildInsertInstallPayloads(data);
    const sql = `
      INSERT INTO simtrampeo(
        personal_id,
        junta_id,
        user_id,
        fecha,
        fechaHora,
        accuracy,
        distancia_qr,
        status,
        ano,
        semana,
        id_bd_cel,
        version,
        trampa_id,
        siembra_id,
        latitud_ins,
        longitud_ins,
        latitud_rev,
        longitud_rev,
        fecha_instalacion,
        captura,
        feromona,
        accion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      await this.db?.run(sql, values);
      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );
      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simtrampeo SET status = 1 WHERE id = ?';
        await this.db?.run(updateStatusSql, [data.captura.id]);
        return {
          status: response.status,
          message: response.message ?? 'Captura actualizada correctamente',
        };
      }
      return {
        status: 'error',
        message: response.message ?? 'No se pudo actualizar la captura',
      };
    } catch (error: any) {
      console.error('Error insertando captura:', error);
      return {
        status: 'error',
        message: error?.message ?? 'Error desconocido al guardar la captura',
      };
    }
  }
  async updateInstalacion(data: CapturaSimtrampeo): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simtrampeo';
    const { params, values } = buildUpdatePayloadsInstalacion(data);
    const sql = `
      UPDATE simtrampeo SET
        personal_id = ?,
        junta_id = ?,
        user_id = ?,
        fecha = ?,
        fechaHora = ?,
        accuracy = ?,
        distancia_qr = ?,
        status = ?,
        ano = ?,
        semana = ?,
        version = ?,
        latitud_ins = ?,
        longitud_ins = ?,
        fecha_instalacion = ?,
        feromona = ?,
        accion = ?
        WHERE id = ?`;

    try {
      await this.db?.run(sql, values);
      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );
      if (response.status === 'success' || response.status === 'warning') {
        return {
          status: response.status,
          message: response.message ?? 'Captura actualizada correctamente',
        };
      }
      return {
        status: 'error',
        message: response.message ?? 'No se pudo actualizar la captura',
      };
    } catch (error: any) {
      console.error('Error insertando captura:', error);
      return {
        status: 'error',
        message: error?.message ?? 'Error desconocido al guardar la captura',
      };
    }
  }
  async update(data: CapturaSimtrampeo): Promise<ApiResponse> {
    let url;
    if (data.instalacion == 0) {
      url = environment.APIUrl + 'trampeo/captura/simtrampeo';
    } else {
      url = environment.APIUrl + 'trampeo/simtrampeo/update';
    }
    const { params, values } = buildUpdatePayloads(data);
    const sql = `
          UPDATE simtrampeo SET
            personal_id = ?,
            junta_id = ?,
            user_id = ?,
            fecha = ?,
            fechaHora = ?,
            accuracy = ?,
            distancia_qr = ?,
            id_bd_cel = ?,
            siembra_id = ?,
            status = ?,
            ano = ?,
            semana = ?,
            version = ?,
            latitud_rev = ?,
            longitud_rev = ?,
            fecha_instalacion = ?,
            captura = ?,
            feromona = ?,
            accion = ?
            WHERE id = ?`;

    try {
      await this.db?.run(sql, values);

      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simtrampeo SET status = 1 WHERE id = ?';
        await this.db?.run(updateStatusSql, [data.captura.id]);
        return {
          status: response.status,
          message: response.message ?? 'Captura actualizada correctamente',
        };
      }
      return {
        status: 'error',
        message: response.message ?? 'No se pudo actualizar la captura',
      };
    } catch (error: any) {
      console.error('Error insertando captura:', error);
      return {
        status: 'error',
        message: error?.message ?? 'Error desconocido al guardar la captura',
      };
    }
  }
  async insert(data: CapturaSimtrampeo): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simtrampeo';
    const { params, values } = buildInserPayloads(data);
    const sql = `
      INSERT INTO simtrampeo(
        personal_id,
        junta_id,
        user_id,
        fecha,
        fechaHora,
        accuracy,
        distancia_qr,
        status,
        ano,
        semana,
        id_bd_cel,
        version,
        trampa_id,
        siembra_id,
        latitud_ins,
        longitud_ins,
        latitud_rev,
        longitud_rev,
        fecha_instalacion,
        captura,
        feromona,
        accion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      const result = await this.db?.run(sql, values);
      const lastId = result?.changes?.lastId;

      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );
      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simtrampeo SET status = 1 WHERE id = ?';
        await this.db?.run(updateStatusSql, [lastId]);
        return {
          status: response.status,
          message: response.message ?? 'Captura actualizada correctamente',
        };
      }
      return {
        status: 'error',
        message: response.message ?? 'No se pudo actualizar la captura',
      };
    } catch (error: any) {
      console.error('Error insertando captura:', error);
      return {
        status: 'error',
        message: error?.message ?? 'Error desconocido al guardar la captura',
      };
    }
  }

  async reenviar(id: any): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simtrampeo';
    try {
      const sql = 'SELECT * FROM simtrampeo WHERE id = ?';
      const res = await this.db?.query(sql, [id]);

      if (!res?.values || res.values.length === 0) {
        throw new Error('No se encontró la captura con el ID proporcionado.');
      }

      const captura = res.values[0];

      const params = {
        id: captura.id_bit,
        trampa_id: captura.trampa_id,
        fecha: captura.fecha,
        semana: captura.semana,
        ano: captura.ano,
        latitud_ins: captura.latitud_ins,
        longitud_ins: captura.longitud_ins,
        latitud_rev: captura.latitud_rev,
        longitud_rev: captura.longitud_rev,
        accuracy: captura.accuracy,
        distancia_qr: captura.distancia_qr,
        fecha_instalacion: captura.fecha_instalacion,
        captura: captura.captura,
        method: 1,
        user_id: captura.user_id,
        personal_id: captura.personal_id,
        junta_id: captura.junta_id,
        id_bd_cel: captura.id_bd_cel,
        fechaHora_cel: captura.fechaHora,
        status: captura.status,
        version: captura.version,
        tipo: 'Reenviando datos',
      };

      const response: any = await lastValueFrom(this.http.post(url, params));

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simtrampeo SET status = 1 WHERE id = ?';
        await this.db?.run(updateStatusSql, [captura.id]);
      }

      return response;
    } catch (error) {
      console.error('Error reenviando captura:', error);
      throw error;
    }
  }
}
