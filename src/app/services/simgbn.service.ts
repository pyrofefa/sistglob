import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {
  buildInsertPayloads,
  buildUpdatePayloads,
  CapturaSimgbn,
} from '../interfaces/captura-simgbn';
import { ApiResponse } from '../interfaces/api-response';
import { ErrorLogService } from './error-log.service';

@Injectable({
  providedIn: 'root',
})
export class SimgbnService {
  private db: SQLiteDBConnection | null = null;
  capturas$ = new EventEmitter<string>();

  constructor(
    private http: HttpClient,
    private logService: ErrorLogService,
  ) {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }

  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS simgbn (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        personal_id TEXT,
        junta_id TEXT,
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
    const sql = `SELECT * FROM simgbn WHERE status = 2`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }

  async capturaId(id: number, fecha: any): Promise<any[]> {
    const sql = `SELECT * FROM simgbn WHERE trampa_id = ? AND fecha = ?`;
    const res = await this.db?.query(sql, [id, fecha]);
    return res?.values ?? [];
  }

  async getCapturas(): Promise<any[]> {
    const sql = `SELECT simgbn.id, simgbn.user_id, simgbn.fecha, simgbn.fechaHora, simgbn.longitud, simgbn.latitud, simgbn.accuracy, simgbn.distancia_qr, simgbn.status, simgbn.trampa_id, simgbn.captura, trampas.name FROM simgbn INNER JOIN trampas ON simgbn.trampa_id = trampas.id_bit ORDER BY simgbn.fechaHora DESC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }

  async getBuscar(fecha: any): Promise<any[]> {
    const sql = `SELECT simgbn.id, simgbn.user_id, simgbn.fecha, simgbn.fechaHora, simgbn.longitud, simgbn.latitud, simgbn.accuracy, simgbn.distancia_qr, simgbn.status, simgbn.trampa_id, simgbn.captura, trampas.name FROM simgbn INNER JOIN trampas ON simgbn.trampa_id = trampas.id_bit WHERE simgbn.fecha = ? ORDER BY simgbn.id DESC`;
    const res = await this.db?.query(sql, [fecha]);
    return res?.values ?? [];
  }
  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simgbn'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }

  async getCapturaId(id: number): Promise<any[]> {
    const sql = `SELECT fenologias.name as fenologia, acciones.name as accion, trampas.name as trampa, simgbn.feromona, simgbn.siembra_id, simgbn.longitud as y, simgbn.latitud as x, simgbn.accuracy, simgbn.captura, simgbn.longitud, simgbn.fechaHora, simgbn.fecha, simgbn.id, trampas.latitud, trampas.longitud, trampas.campo FROM trampas INNER JOIN simgbn ON simgbn.trampa_id = trampas.id_bit LEFT JOIN fenologias ON simgbn.fenologia = fenologias.id LEFT JOIN acciones ON simgbn.accion = acciones.id WHERE simgbn.id = ? AND acciones.campana_id = 2 LIMIT 1`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async insert(data: CapturaSimgbn): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simgbn';
    const { params, values } = buildInsertPayloads(data);
    const sql = `
            INSERT INTO simgbn(
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
              fenologia,
              captura,
              accion,
              feromona
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
      // 1️⃣ Guardar localmente (si falla aquí, sí detenemos todo)
      const result = await this.db?.run(sql, values);
      const lastId = result?.changes?.lastId;

      // 2️⃣ Intentar enviar al servidor (pero no detener si falla)
      try {
        const response: any = await lastValueFrom(
          this.http.post<ApiResponse>(url, params),
        );

        if (response.status === 'success' || response.status === 'warning') {
          const updateStatusSql = 'UPDATE simgbn SET status = 1 WHERE id = ?';
          await this.db?.run(updateStatusSql, [lastId]);
          return {
            status: response.status,
            message:
              response.message ?? 'Registro guardado localmente y en línea',
          };
        }

        return {
          status: 'warning',
          message: response.message ?? 'Registro guardado localmente',
        };
      } catch (httpError: any) {
        // Sin internet u otro error HTTP
        this.logService.agregarLog({
          date: new Date().toISOString(),
          message: 'Error enviando captura (offline)',
          detail: httpError?.message || '',
        });

        return {
          status: 'warning',
          message: 'Registro guardado localmente',
        };
      }
    } catch (dbError: any) {
      // Errores críticos de base de datos
      console.error('❌ Error insertando captura simgbn:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido insertando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }

  async update(data: CapturaSimgbn): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simgbn';
    const { params, values } = buildUpdatePayloads(data);

    const sql = `
              UPDATE simgbn SET
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
                fenologia = ?,
                captura = ?,
                accion = ?,
                feromona = ?
              WHERE id = ?`;

    try {
      // 1️⃣ Actualizar localmente (si falla aquí, se detiene)
      await this.db?.run(sql, values);

      // 2️⃣ Intentar enviar al servidor (pero no detener si falla)
      try {
        const response: any = await lastValueFrom(
          this.http.post<ApiResponse>(url, params),
        );

        if (response.status === 'success' || response.status === 'warning') {
          const updateStatusSql = 'UPDATE simgbn SET status = 1 WHERE id = ?';
          await this.db?.run(updateStatusSql, [data.captura.id]);
          return {
            status: response.status,
            message:
              response.message ?? 'Registro guardado localmente y en línea',
          };
        }

        return {
          status: 'warning',
          message: response.message ?? 'Registro guardado localmenteo',
        };
      } catch (httpError: any) {
        this.logService.agregarLog({
          date: new Date().toISOString(),
          message: 'Error enviando captura (offline)',
          detail: httpError?.message || '',
        });

        return {
          status: 'warning',
          message: 'Registro guardado localmente',
        };
      }
    } catch (dbError: any) {
      // Errores críticos de base de datos → sí se reportan
      console.error('❌ Error actualizando captura simgbn:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido actualizando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }
  async subir(): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simgbn';

    try {
      // 1️⃣ Leer capturas pendientes (si falla aquí, se detiene)
      const query = 'SELECT * FROM simgbn WHERE status = 2 ORDER BY id ASC';
      const res = await this.db?.query(query);

      const capturas = res?.values ?? [];
      if (capturas.length === 0) {
        return {
          status: 'info',
          message: 'No hay capturas pendientes de subir',
        };
      }

      // 2️⃣ Recorrer capturas y subirlas
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
          fenologia_id: captura.fenologia,
          method: 1,
          user_id: captura.user_id,
          personal_id: captura.personal_id,
          junta_id: captura.junta_id,
          id_bd_cel: captura.id_bd_cel,
          fechaHora_cel: captura.fechaHora,
          version: captura.version,
          accion: captura.accion,
          feromona: captura.feromona,
          status: 1,
          tipo: 'Subir Datos',
        };

        try {
          const response: any = await lastValueFrom(
            this.http.post(url, params),
          );

          if (response.status === 'success' || response.status === 'warning') {
            const updateSQL = 'UPDATE simgbn SET status = 1 WHERE id = ?';
            await this.db?.run(updateSQL, [captura.id]);
          } else {
            this.logService.agregarLog({
              date: new Date().toISOString(),
              message: 'Error al subir captura (respuesta no exitosa)',
              detail: response.message ?? '',
            });
          }
        } catch (httpError: any) {
          // No detenemos el bucle, solo registramos
          this.logService.agregarLog({
            date: new Date().toISOString(),
            message: 'Error enviando captura (offline)',
            detail: httpError?.message || '',
          });
        }
      }

      return { status: 'success', message: 'Proceso de subida finalizado' };
    } catch (dbError: any) {
      // Errores de SQLite sí detienen el proceso
      console.error('❌ Error leyendo capturas simgbn:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido leyendo capturas',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }

  async reenviar(id: any): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simgbn';

    try {
      // 1️⃣ Obtener captura localmente (si falla aquí, detener)
      const sql = 'SELECT * FROM simgbn WHERE id = ?';
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
        fenologia_id: captura.fenologia,
        method: 1,
        user_id: captura.user_id,
        personal_id: captura.personal_id,
        junta_id: captura.junta_id,
        id_bd_cel: captura.id_bd_cel,
        fechaHora_cel: captura.fechaHora,
        version: captura.version,
        accion: captura.accion,
        feromona: captura.feromona,
        status: 1,
        tipo: 'Reenviando Datos',
      };

      // 2️⃣ Intentar enviar al servidor (pero no detener si falla)
      try {
        const response: any = await lastValueFrom(this.http.post(url, params));

        if (response.status === 'success' || response.status === 'warning') {
          const updateStatusSql = 'UPDATE simgbn SET status = 1 WHERE id = ?';
          await this.db?.run(updateStatusSql, [captura.id]);
        }

        return response;
      } catch (httpError: any) {
        // Sin internet u otro error HTTP
        this.logService.agregarLog({
          date: new Date().toISOString(),
          message: 'Error reenviando captura (offline)',
          detail: httpError?.message || '',
        });

        return {
          status: 'warning',
          message: 'Captura pendiente de reenvío (sin conexión)',
        };
      }
    } catch (dbError: any) {
      // Errores críticos de base de datos → sí se detiene
      console.error('❌ Error reenviando captura simgbn:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido reenviando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }
}
