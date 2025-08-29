import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import {
  buildInsertPayloads,
  buildUpdatePayloads,
  CapturaSimdia,
} from '../interfaces/captura-simdia';
import { ErrorLogService } from './error-log.service';

@Injectable({
  providedIn: 'root',
})
export class SimdiaService {
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
      CREATE TABLE IF NOT EXISTS simdia (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          junta_id TEXT,
          user_id TEXT,
          personal_id TEXT,
          fecha TEXT,
          fechaHora TEXT,
          longitud REAL,
          latitud REAL,
          accuracy REAL,
          distancia_qr REAL,
          status INTERGER,
          trampa_id INTERGER,
          captura INTERGER,
          fenologia_id INTERGER,
          instalada INTERGER,
          noa INTERGER,
          non INTERGER,
          nof INTERGER,
          sua INTERGER,
          sun INTERGER,
          suf INTERGER,
          esa INTERGER,
          esn INTERGER,
          esf INTERGER,
          oea INTERGER,
          oen INTERGER,
          oef INTERGER,
          ano TEXT,
          semana TEXT,
          id_bd_cel INTERGER,
          siembra_id INTERGER,
          revisada INTERGER,
          observacion INTERGER
        );
      `;
    await this.db?.execute(sql);
  }
  async conteo(): Promise<any[]> {
    const sql = `SELECT * FROM simdia WHERE status = 2`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async capturaId(id: number, fecha: any): Promise<any[]> {
    const sql = `SELECT * FROM simdia WHERE trampa_id = ? AND fecha = ?`;
    const res = await this.db?.query(sql, [id, fecha]);
    return res?.values ?? [];
  }
  async getCapturas(): Promise<any[]> {
    const sql = `SELECT simdia.id, simdia.user_id, simdia.fecha, simdia.fechaHora, simdia.longitud, simdia.latitud, simdia.accuracy, simdia.distancia_qr, simdia.status, simdia.trampa_id, simdia.captura, simdia.fenologia_id, simdia.instalada, trampas.name FROM simdia INNER JOIN trampas ON simdia.trampa_id = trampas.id_bit ORDER BY simdia.fechaHora DESC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async getBuscar(fecha: any): Promise<any[]> {
    const sql = `SELECT simdia.id, simdia.user_id, simdia.fecha, simdia.fechaHora, simdia.longitud, simdia.latitud, simdia.accuracy, simdia.distancia_qr, simdia.status, simdia.trampa_id, simdia.captura, simdia.fenologia_id, simdia.instalada, trampas.name FROM simdia INNER JOIN trampas ON simdia.trampa_id = trampas.id_bit WHERE simdia.fecha = ? ORDER BY simdia.id DESC`;
    const res = await this.db?.query(sql, [fecha]);
    return res?.values ?? [];
  }
  async getCapturaId(id: number): Promise<any[]> {
    const sql = `SELECT fenologias.name as fenologia, trampas.name as trampa, simdia.id, simdia.siembra_id, simdia.longitud,simdia.latitud, simdia.accuracy, simdia.instalada, simdia.captura, simdia.longitud, simdia.fechaHora, simdia.fecha, simdia.revisada, simdia.observacion, trampas.latitud, trampas.longitud, trampas.campo, simdia.noa, simdia.non, simdia.nof, simdia.sua, simdia.sun, simdia.suf, simdia.esa, simdia.esn, simdia.esf, simdia.oea, simdia.oen, simdia.oef, observaciones.name as motivo FROM trampas INNER JOIN simdia ON simdia.trampa_id = trampas.id_bit LEFT JOIN fenologias ON simdia.fenologia_id = fenologias.id LEFT JOIN observaciones ON simdia.observacion = observaciones.id WHERE simdia.id = ? AND fenologias.campana_id = 4 AND trampas.campana_id = 4`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simdia'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }

  async insert(data: CapturaSimdia): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simdia';
    const { params, values } = buildInsertPayloads(data);
    const sql = `
      INSERT INTO simdia(
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
        captura,
        fenologia_id,
        instalada,
        revisada,
        observacion,
        noa,
        non,
        nof,
        sua,
        sun,
        suf,
        esa,
        esn,
        esf,
        oea,
        oen,
        oef
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

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
          const updateStatusSql = 'UPDATE simdia SET status = 1 WHERE id = ?';
          await this.db?.run(updateStatusSql, [lastId]);
          return {
            status: response.status,
            message:
              response.message ?? 'Registro guardado localmente y en línea',
          };
        }

        return {
          status: 'warning',
          message: response.message ?? '',
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
          message: ''
        };
      }
    } catch (dbError: any) {
      // Errores críticos de base de datos
      console.log('Error insertando captura: ' + dbError.message);
      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido insertando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }

  async update(data: CapturaSimdia): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simdia';
    const { params, values } = buildUpdatePayloads(data);

    const sql = `
      UPDATE simdia SET
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
        captura = ?,
        fenologia_id = ?,
        instalada = ?,
        revisada = ?,
        observacion = ?,
        noa = ?,
        non = ?,
        nof = ?,
        sua = ?,
        sun = ?,
        suf = ?,
        esa = ?,
        esn = ?,
        esf = ?,
        oea = ?,
        oen = ?,
        oef = ?
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
          message: response.message ?? '',
        };
      } catch (httpError: any) {
        this.logService.agregarLog({
          date: new Date().toISOString(),
          message: 'Error enviando captura (offline)',
          detail: httpError?.message || '',
        });

        return {
          status: 'warning',
          message: '',
        };
      }
    } catch (dbError: any) {
      // Errores críticos de base de datos → sí se reportan
      console.log('Error actualizando captura: ' + dbError.message);
      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido actualizando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }

  async subir(): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simdia';
    try {
      // 1️⃣ Leer capturas pendientes (si falla aquí, se detiene)
      const query = 'SELECT * FROM simdia WHERE status = 2 ORDER BY id ASC';
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
        let posicion = captura.latitud + ',' + captura.longitud;

        const params: any = {
          fecha: captura.fecha,
          ano: captura.ano,
          semana: captura.semana,
          trampa_id: captura.trampa_id,
          posicion: posicion,
          accuracy: captura.accuracy,
          fenologia_trampa_id: captura.fenologia_id,
          captura: captura.captura,
          noa: captura.noa,
          non: captura.non,
          nof: captura.nof,
          sua: captura.sua,
          sun: captura.sun,
          suf: captura.suf,
          esa: captura.esa,
          esn: captura.esn,
          esf: captura.esf,
          oea: captura.oea,
          oen: captura.oen,
          oef: captura.oef,
          status: 1,
          id_bd_cel: captura.id_bd_cel,
          fecha_cel: captura.fechaHora,
          method: 1,
          instalada: captura.instalada,
          revisada: captura.revisada,
          observacion: captura.observacion,
          distancia_qr: captura.distancia_qr,
          user_id: captura.user_id,
          personal_id: captura.personal_id,
          junta_id: captura.junta_id,
          version: captura.version,
          tipo: 'Subir Datos',
        };

        try {
          const response: any = await lastValueFrom(
            this.http.post(url, params),
          );

          if (response.status === 'success' || response.status === 'warning') {
            const updateSQL = 'UPDATE simdia SET status = 1 WHERE id = ?';
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
      console.log('Error al leer capturas para subir: ' + dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido leyendo capturas',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }
  async reenviar(id: any): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simdia';

    try {
      // 1️⃣ Obtener captura localmente (si falla aquí, detener)
      const sql = 'SELECT * FROM simdia WHERE id = ?';
      const res = await this.db?.query(sql, [id]);

      if (!res?.values || res.values.length === 0) {
        throw new Error('No se encontró la captura con el ID proporcionado.');
      }

      const captura = res.values[0];
      let posicion = captura.latitud + ',' + captura.longitud;

      const params = {
        fecha: captura.fecha,
        ano: captura.ano,
        semana: captura.semana,
        trampa_id: captura.trampa_id,
        posicion: posicion,
        accuracy: captura.accuracy,
        fenologia_trampa_id: captura.fenologia_id,
        captura: captura.captura,
        noa: captura.noa,
        non: captura.non,
        nof: captura.nof,
        sua: captura.sua,
        sun: captura.sun,
        suf: captura.suf,
        esa: captura.esa,
        esn: captura.esn,
        esf: captura.esf,
        oea: captura.oea,
        oen: captura.oen,
        oef: captura.oef,
        status: 1,
        id_bd_cel: captura.id_bd_cel,
        fecha_cel: captura.fechaHora,
        method: 1,
        instalada: captura.instalada,
        revisada: captura.revisada,
        observacion: captura.observacion,
        distancia_qr: captura.distancia_qr,
        user_id: captura.user_id,
        personal_id: captura.personal_id,
        junta_id: captura.junta_id,
        version: captura.version,
        tipo: 'Reenviando Datos',
      };

      // 2️⃣ Intentar enviar al servidor (pero no detener si falla)
      try {
        const response: any = await lastValueFrom(this.http.post(url, params));

        if (response.status === 'success' || response.status === 'warning') {
          const updateStatusSql = 'UPDATE simdia SET status = 1 WHERE id = ?';
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
          message: 'Problemas de conexión con el servidor',
        };
      }
    } catch (dbError: any) {
      // Errores críticos de base de datos → sí se detiene
      console.log('Error reenviando captura: ' + dbError);

      this.logService.agregarLog({
        date: new Date().toISOString(),
        message: dbError.stack || 'Error desconocido reenviando captura',
        detail: dbError.message || '',
      });

      throw dbError;
    }
  }
}
