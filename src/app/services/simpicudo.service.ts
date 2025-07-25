import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {
  buildInsertPayloads,
  buildUpdatePayloads,
  CapturaSimpicudo,
} from '../interfaces/captura-simpicudo';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class SimpicudoService {
  private db: SQLiteDBConnection | null = null;
  capturas$ = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }

  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS simpicudo (
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
        captura INTERGER,
        infestacion INTERGER,
        fenologia INTERGER,
        ano TEXT,
        semana TEXT,
        id_bd_cel INTERGER,
        siembra_id INTERGER
      );
      `;
    await this.db?.execute(sql);
  }

  async conteo(): Promise<any[]> {
    const sql = `SELECT * FROM simpicudo WHERE status = 2`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }

  async capturaId(id: number, fecha: any): Promise<any[]> {
    const sql = `SELECT * FROM simpicudo WHERE trampa_id = ? AND fecha = ?`;
    const res = await this.db?.query(sql, [id, fecha]);
    return res?.values ?? [];
  }

  async getCapturas(): Promise<any[]> {
    const sql = `SELECT simpicudo.id, simpicudo.user_id, simpicudo.fecha, simpicudo.fechaHora, simpicudo.longitud, simpicudo.latitud, simpicudo.accuracy, simpicudo.distancia_qr, simpicudo.status, simpicudo.trampa_id, simpicudo.captura, simpicudo.fenologia, trampas.name FROM simpicudo INNER JOIN trampas ON simpicudo.trampa_id = trampas.id_bit WHERE trampas.campana_id = 8 ORDER BY simpicudo.fechaHora DESC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async getBuscar(fecha: any): Promise<any[]> {
    const sql = `SELECT simpicudo.id, simpicudo.user_id, simpicudo.fecha, simpicudo.fechaHora, simpicudo.longitud, simpicudo.latitud, simpicudo.accuracy, simpicudo.distancia_qr, simpicudo.status, simpicudo.trampa_id, simpicudo.captura, simpicudo.fenologia, trampas.name FROM simpicudo INNER JOIN trampas ON simpicudo.trampa_id = trampas.id_bit WHERE trampas.campana_id = 8 AND simpicudo.fecha = ? ORDER BY simpicudo.id DESC`;
    const res = await this.db?.query(sql, [fecha]);
    return res?.values ?? [];
  }

  async getCapturaId(id: number): Promise<any[]> {
    const sql = `SELECT fenologias.name as fenologia, trampas.name as trampa, simpicudo.id, simpicudo.siembra_id, simpicudo.captura, simpicudo.infestacion, simpicudo.feromona, acciones.name as accion,  simpicudo.longitud as y, simpicudo.latitud as x, simpicudo.accuracy, simpicudo.fechaHora, simpicudo.fecha, trampas.latitud, trampas.longitud, trampas.campo FROM trampas INNER JOIN simpicudo ON simpicudo.trampa_id = trampas.id_bit LEFT JOIN fenologias ON simpicudo.fenologia = fenologias.id LEFT JOIN acciones ON simpicudo.accion = acciones.id WHERE simpicudo.id = ? AND fenologias.campana_id = 8 AND trampas.campana_id = 8 LIMIT 1`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simpicudo'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }

  async insert(data: CapturaSimpicudo): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simpicudo';
    const { params, values } = buildInsertPayloads(data);
    const sql = `
        INSERT INTO simpicudo(
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
          feromona,
          fenologia,
          captura
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    console.log('Valores del INSERT:', values);

    try {
      const result = await this.db?.run(sql, values);
      const lastId = result?.changes?.lastId;

      console.log('Valores del INSERT:', values);

      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simpicudo SET status = 1 WHERE id = ?';
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

  async update(data: CapturaSimpicudo): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simpicudo';
    const { params, values } = buildUpdatePayloads(data);

    const sql = `
          UPDATE simpicudo SET
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
            version = ?,
            trampa_id = ?,
            siembra_id = ?,
            accion = ?,
            feromona = ?,
            fenologia = ?,
            captura = ?
          WHERE id = ?`;

    try {
      const result = await this.db?.run(sql, values);
      const lastId = result?.changes?.lastId;

      const response: any = await lastValueFrom(
        this.http.post<ApiResponse>(url, params),
      );

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simpicudo SET status = 1 WHERE id = ?';
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

  async subir(): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simpicudo';
    try {
      const query = 'SELECT * FROM simpicudo WHERE status = 2 ORDER BY id ASC';
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
          captura: captura.captura,
          fenologia: captura.fenologia,
          infestacion: captura.infestacion,
          method: 1,
          user_id: captura.user_id,
          personal_id: captura.personal_id,
          junta_id: captura.junta_id,
          id_bd_cel: captura.id_bd_cel,
          fechaHora_cel: captura.fechaHora,
          version: captura.version,
          status: 1,
          tipo: 'Subir Datos',
        };

        try {
          const response: any = await lastValueFrom(
            this.http.post(url, params),
          );
          if (response.status === 'success' || response.status === 'warning') {
            const updateSQL = 'UPDATE simpicudo SET status = 1 WHERE id = ?';
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
    const url = environment.APIUrl + 'trampeo/captura/simpicudo';
    try {
      const sql = 'SELECT * FROM simpicudo WHERE id = ?';
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
        captura: captura.captura,
        fenologia: captura.fenologia,
        infestacion: captura.infestacion,
        method: 1,
        user_id: captura.user_id,
        personal_id: captura.personal_id,
        junta_id: captura.junta_id,
        id_bd_cel: captura.id_bd_cel,
        fechaHora_cel: captura.fechaHora,
        version: captura.version,
        status: 1,
        tipo: 'Reenviando Datos',
      };

      const response: any = await lastValueFrom(this.http.post(url, params));

      if (response.status === 'success' || response.status === 'warning') {
        const updateStatusSql = 'UPDATE simpicudo SET status = 1 WHERE id = ?';
        await this.db?.run(updateStatusSql, [captura.id]);
      }

      return response;
    } catch (error) {
      console.error('Error reenviando captura:', error);
      throw error;
    }
  }
}
