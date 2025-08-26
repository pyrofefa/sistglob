import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import {
  CapturaSimpp,
  buildInsertPayloads,
  buildUpdatePayloads,
} from '../interfaces/captura-simpp';
import { ErrorLogService } from './error-log.service';

@Injectable({
  providedIn: 'root',
})
export class SimppService {
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
      CREATE TABLE IF NOT EXISTS simpp (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        junta_id TEXT,
        personal_id TEXT,
        user_id TEXT,
        fecha TEXT,
        fechaHora TEXT,
        fechaHoraSat TEXT,
        longitud REAL,
        latitud REAL,
        accuracy REAL,
        distancia_qr REAL,
        status INTERGER,
        trampa_id INTERGER,
        captura INTERGER,
        fenologia_id INTERGER,
        instalada INTERGER,
        ano TEXT,
        semana TEXT,
        id_bd_cel INTERGER,
        siembra_id INTERGER,
        revisada INTERGER,
        observacion INTERGER,
        atrayente INTERGER
      );
      `;
    await this.db?.execute(sql);
  }
  async conteo(): Promise<any[]> {
    const sql = `SELECT * FROM simpp WHERE status = 2`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }

  async capturaId(id: number, fecha: any): Promise<any[]> {
    const sql = `SELECT * FROM simpp WHERE trampa_id = ? AND fecha = ?`;
    const res = await this.db?.query(sql, [id, fecha]);
    return res?.values ?? [];
  }

  async getCapturas(): Promise<any[]> {
    const sql = `SELECT simpp.id, simpp.user_id, simpp.fecha, simpp.fechaHora, simpp.longitud, simpp.latitud, simpp.accuracy, simpp.distancia_qr, simpp.status, simpp.trampa_id, simpp.captura, simpp.fenologia_id, trampas.name FROM simpp INNER JOIN trampas ON simpp.trampa_id = trampas.id_bit WHERE trampas.campana_id = 6 ORDER BY simpp.fechaHora DESC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async getBuscar(fecha: any): Promise<any[]> {
    const sql = `SELECT simpp.id, simpp.user_id, simpp.fecha, simpp.fechaHora, simpp.longitud, simpp.latitud, simpp.accuracy, simpp.distancia_qr, simpp.status, simpp.trampa_id, simpp.captura, simpp.fenologia_id, trampas.name FROM simpp INNER JOIN trampas ON simpp.trampa_id = trampas.id_bit WHERE trampas.campana_id = 6 AND simpp.fecha = ? ORDER BY simpp.id DESC`;
    const res = await this.db?.query(sql, [fecha]);
    return res?.values ?? [];
  }

  async getCapturaId(id: number): Promise<any[]> {
    const sql = `SELECT observaciones.name as observacion, fenologias.name AS fenologia,	trampas.name AS trampa,	simpp.id,	simpp.siembra_id,	simpp.captura, simpp.feromona,	acciones.name AS accion,	simpp.longitud AS y,	simpp.latitud AS x,	simpp.accuracy,	simpp.fechaHora,	simpp.fecha,	trampas.latitud,	trampas.longitud,	trampas.campo,	simpp.atrayente,	simpp.revisada,	simpp.instalada FROM trampas INNER JOIN simpp ON simpp.trampa_id = trampas.id_bit	LEFT JOIN fenologias ON simpp.fenologia_id = fenologias.id LEFT JOIN observaciones ON simpp.observacion = observaciones.id	INNER JOIN acciones ON simpp.accion = acciones.id WHERE	simpp.id = ? AND fenologias.campana_id = 6 AND trampas.campana_id = 6 AND acciones.campana_id = 6 LIMIT 1`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simpp'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }
  async insert(data: CapturaSimpp): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simpp';
    const { params, values } = buildInsertPayloads(data);

    const sql = `
      INSERT INTO simpp(
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
        observacion,
        captura,
        fenologia_id,
        atrayente,
        feromona,
        instalada,
        revisada
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
          const updateStatusSql = 'UPDATE simpp SET status = 1 WHERE id = ?';
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
      console.error('❌ Error insertando captura simpp:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido insertando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }

  async update(data: CapturaSimpp): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simpp';
    const { params, values } = buildUpdatePayloads(data);

    const sql = `
        UPDATE simpp SET
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
          observacion = ?,
          captura = ?,
          fenologia_id = ?,
          atrayente = ?,
          feromona = ?,
          instalada = ?,
          revisada = ?
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
          const updateStatusSql = 'UPDATE simdia SET status = 1 WHERE id = ?';
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
      console.error('❌ Error actualizando captura simpp:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido actualizando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }

  async subir(): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simpp';

    try {
      // 1️⃣ Leer capturas pendientes (si falla aquí, se detiene)
      const query = 'SELECT * FROM simpp WHERE status = 2 ORDER BY id ASC';
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
          fenologia_id: captura.fenologia_id,
          trampas_instaladas: captura.instalada,
          trampas_revisadas: captura.revisada,
          cambio_atrayente: captura.atrayente,
          observacion_id: captura.observacion,
          method: 1,
          user_id: captura.user_id,
          personal_id: captura.personal_id,
          junta_id: captura.junta_id,
          id_bd_cel: captura.id_bd_cel,
          fechaHora_cel: captura.fechaHora,
          fechaHora_sat: captura.fechaHoraSat,
          version: captura.version,
          status: 1,
          tipo: 'Subir Datos',
        };

        try {
          const response: any = await lastValueFrom(
            this.http.post(url, params),
          );

          if (response.status === 'success' || response.status === 'warning') {
            const updateSQL = 'UPDATE simpp SET status = 1 WHERE id = ?';
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
      console.error('❌ Error leyendo capturas simpp:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido leyendo capturas',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }

  async reenviar(id: any): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simpp';

    try {
      // 1️⃣ Obtener captura localmente (si falla aquí, detener)
      const sql = 'SELECT * FROM simpp WHERE id = ?';
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
        fenologia_id: captura.fenologia_id,
        trampas_instaladas: captura.instalada,
        trampas_revisadas: captura.revisada,
        cambio_atrayente: captura.atrayente,
        observacion_id: captura.observacion,
        method: 1,
        user_id: captura.user_id,
        personal_id: captura.personal_id,
        junta_id: captura.junta_id,
        id_bd_cel: captura.id_bd_cel,
        fechaHora_cel: captura.fechaHora,
        fechaHora_sat: captura.fechaHoraSat,
        version: captura.version,
        status: 1,
        tipo: 'Reenviando Datos',
      };

      // 2️⃣ Intentar enviar al servidor (pero no detener si falla)
      try {
        const response: any = await lastValueFrom(this.http.post(url, params));

        if (response.status === 'success' || response.status === 'warning') {
          const updateStatusSql = 'UPDATE simpp SET status = 1 WHERE id = ?';
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
      console.error('❌ Error reenviando captura simpp:', dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido reenviando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }
}
