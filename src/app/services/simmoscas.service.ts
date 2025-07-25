import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {
  buildInsertPayloads,
  buildUpdatePayloads,
  CapturaSimmoscas,
} from '../interfaces/captura-simmoscas';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class SimmoscasService {
  private db: SQLiteDBConnection | null = null;
  capturas$ = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }

  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS simmoscas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        junta_id TEXT,
        personal_id TEXT,
        user_id TEXT,
        fecha TEXT,
        fechaHora TEXT,
        longitud REAL,
        latitud REAL,
        accuracy REAL,
        distancia_qr REAL,
        status INTERGER,
        trampa_id INTERGER,
        ano TEXT,
        semana TEXT,
        id_bd_cel INTERGER,
        siembra_id INTERGER,
        accion INTERGER,
        omision INTERGER,
        machos INTERGER,
        hembras INTERGER,
        gancho INTERGER,
        recebado INTERGER,
        instalada INTERGER
      );
      `;
    await this.db?.execute(sql);
  }
  async conteo(): Promise<any[]> {
    const sql = `SELECT * FROM simmoscas WHERE status = 2`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simmoscas'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }
  async capturaId(id: number, fecha: any): Promise<any[]> {
    const sql = `SELECT * FROM simmoscas WHERE trampa_id = ? AND fecha = ?`;
    const res = await this.db?.query(sql, [id, fecha]);
    return res?.values ?? [];
  }

  async getCapturas(): Promise<any[]> {
    const sql = `SELECT simmoscas.id, simmoscas.user_id, simmoscas.fecha, simmoscas.fechaHora, simmoscas.longitud, simmoscas.latitud, simmoscas.accuracy, simmoscas.distancia_qr, simmoscas.status, simmoscas.trampa_id, simmoscas.machos, simmoscas.instalada, trampas.name FROM simmoscas INNER JOIN trampas ON simmoscas.trampa_id = trampas.id_bit WHERE trampas.campana_id = 5 ORDER BY simmoscas.fechaHora DESC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async getBuscar(fecha: any): Promise<any[]> {
    const sql = `SELECT simmoscas.id, simmoscas.user_id, simmoscas.fecha, simmoscas.fechaHora, simmoscas.longitud, simmoscas.latitud, simmoscas.accuracy, simmoscas.distancia_qr, simmoscas.status, simmoscas.trampa_id, simmoscas.machos, simmoscas.instalada, trampas.name FROM simmoscas INNER JOIN trampas ON simmoscas.trampa_id = trampas.id_bit WHERE trampas.campana_id = 5 AND simmoscas.fecha = ? ORDER BY simmoscas.id DESC`;
    const res = await this.db?.query(sql, [fecha]);
    return res?.values ?? [];
  }

  async getCapturaId(id: number): Promise<any[]> {
    const sql = `SELECT fenologias.name as fenologia, omisiones.name as omision, acciones.name as accion, trampas.name as trampa, simmoscas.siembra_id, simmoscas.recebado, simmoscas.gancho, simmoscas.longitud as y, simmoscas.latitud as x, simmoscas.accuracy, simmoscas.instalada, simmoscas.fechaHora, simmoscas.accion as accion_id, simmoscas.fecha, simmoscas.machos, simmoscas.hembras, simmoscas.id, trampas.latitud, trampas.longitud, trampas.campo FROM trampas INNER JOIN simmoscas ON simmoscas.trampa_id = trampas.id_bit LEFT JOIN acciones ON simmoscas.accion = acciones.id LEFT JOIN fenologias ON simmoscas.fenologia = fenologias.id AND fenologias.campana_id = 5 LEFT JOIN omisiones ON simmoscas.omision = omisiones.id WHERE simmoscas.id = ? AND trampas.campana_id = 5 LIMIT 1`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async insert(data: CapturaSimmoscas): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simmoscas';
    const { params, values } = buildInsertPayloads(data);
    const sql = `
        INSERT INTO simmoscas (
          personal_id,
          junta_id,
          user_id,
          fecha,
          fechaHora,
          longitud,
          latitud,
          accuracy,
          distancia_qr,
          status,
          ano,
          semana,
          id_bd_cel,
          version,
          trampa_id,
          siembra_id,
          accion,
          omision,
          machos,
          hembras,
          instalada,
          gancho,
          recebado,
          fenologia ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      const result = await this.db?.run(sql, values);
      const lastId = result?.changes?.lastId;

      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simmoscas SET status = 1 WHERE id = ?';
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

  async update(data: CapturaSimmoscas): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simmoscas';
    const { params, values } = buildUpdatePayloads(data);

    const sql = `
        UPDATE simmoscas SET
          personal_id = ?,
          junta_id = ?,
          user_id = ?,
          fecha = ?,
          fechaHora = ?,
          longitud = ?,
          latitud = ?,
          accuracy = ?,
          distancia_qr = ?,
          status = ?,
          ano = ?,
          semana = ?,
          id_bd_cel = ?,
          version = ?,
          trampa_id = ?,
          siembra_id = ?,
          accion = ?,
          omision = ?,
          machos = ?,
          hembras = ?,
          instalada = ?,
          gancho = ?,
          recebado = ?,
          fenologia = ?
        WHERE id = ?`;

    try {
      const result = await this.db?.run(sql, values);
      const lastId = result?.changes?.lastId;

      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simmoscas SET status = 1 WHERE id = ?';
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

  async subir(): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simmoscas';
    try {
      const query = 'SELECT * FROM simmoscas WHERE status = 2 ORDER BY id ASC';
      const res = await this.db?.query(query);

      const capturas = res?.values ?? [];

      for (const captura of capturas) {
        const params: any = {
          trampa_id: captura.trampa_id,
          fecha: captura.fecha,
          semana: captura.semana,
          ano: captura.ano,
          latitud: captura.latitud,
          longitud: captura.longitud,
          accuracy: captura.accuracy,
          distancia_qr: captura.distancia_qr,
          method: 1,
          user_id: captura.user_id,
          personal_id: captura.personal_id,
          junta_id: captura.junta_id,
          id_bd_cel: captura.id_bd_cel,
          fechaHora_cel: captura.fechaHora,
          status: 1,
          accion: captura.accion,
          omision: captura.omision,
          machos: captura.machos,
          hembras: captura.hembras,
          instalada: captura.instalada,
          gancho: captura.gancho,
          recebado: captura.recebado,
          version: captura.version,
          fenologia: captura.fenologia,
          tipo: 'Subir Datos',
        };

        try {
          const response: any = await lastValueFrom(
            this.http.post(url, params),
          );
          if (response.status === 'success' || response.status === 'warning') {
            const updateSQL = 'UPDATE simmoscas SET status = 1 WHERE id = ?';
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
  async reenviar(id: any): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simmoscas';
    try {
      const sql = 'SELECT * FROM simmoscas WHERE id = ?';
      const res = await this.db?.query(sql, [id]);

      if (!res?.values || res.values.length === 0) {
        throw new Error('No se encontró la captura con el ID proporcionado.');
      }

      const captura = res.values[0];

      const params = {
        trampa_id: captura.trampa_id,
        fecha: captura.fecha,
        semana: captura.semana,
        ano: captura.ano,
        latitud: captura.latitud,
        longitud: captura.longitud,
        accuracy: captura.accuracy,
        distancia_qr: captura.distancia_qr,
        method: 1,
        user_id: captura.user_id,
        personal_id: captura.personal_id,
        junta_id: captura.junta_id,
        id_bd_cel: captura.id_bd_cel,
        fechaHora_cel: captura.fechaHora,
        status: 1,
        accion: captura.accion,
        omision: captura.omision ?? 0,
        machos: captura.machos,
        hembras: captura.hembras,
        instalada: captura.instalada,
        gancho: captura.gancho,
        recebado: captura.recebado,
        version: captura.version,
        fenologia: captura.fenologia,
        tipo: 'Reenviando Datos',
      };

      const response: any = await lastValueFrom(this.http.post(url, params));

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simmoscas SET status = 1 WHERE id = ?';
        await this.db?.run(updateStatusSql, [captura.id]);
      }

      return response;
    } catch (error) {
      console.error('Error reenviando captura:', error);
      throw error;
    }
  }


}
