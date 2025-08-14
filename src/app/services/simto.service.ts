import { EventEmitter, Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import {
  buildInsertPayloads,
  buildUpdatePayloads,
  CapturaSimto,
} from '../interfaces/captura-simto';

@Injectable({
  providedIn: 'root',
})
export class SimtoService {
  private db: SQLiteDBConnection | null = null;
  capturas$ = new EventEmitter<string>();

  constructor(private http: HttpClient) {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }
  async createTable(): Promise<void> {
    const sql = `
      CREATE TABLE IF NOT EXISTS simto (
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
        totalTrampas INTERGER,
        totalInsectos INTERGER,
        fenologia INTERGER
      );
      `;
    await this.db?.execute(sql);
  }
  async conteo(): Promise<any[]> {
    const sql = `SELECT * FROM simto WHERE status = 2`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async capturaId(id: number, fecha: any): Promise<any[]> {
    const sql = `SELECT SUM(simto_detalle.captura) as total, COUNT(simto_detalle.id) as punto, simto.fenologia, simto.id, simto.status FROM simto LEFT JOIN simto_detalle ON simto_detalle.id_simto = simto.id WHERE simto.trampa_id = ? AND simto.fecha = ?`;
    const res = await this.db?.query(sql, [id, fecha]);
    return res?.values ?? [];
  }

  async getCapturas(): Promise<any[]> {
    const sql = `SELECT simto.id, simto.user_id, simto.fecha, simto.fechaHora, simto.longitud, simto.latitud, simto.accuracy, simto.distancia_qr, simto.status, simto.trampa_id, simto.fenologia, trampas.name FROM simto INNER JOIN trampas ON simto.trampa_id = trampas.id_bit WHERE trampas.campana_id = 7 ORDER BY simto.fechaHora DESC`;
    const res = await this.db?.query(sql);
    return res?.values ?? [];
  }
  async getBuscar(fecha: any): Promise<any[]> {
    const sql = `SELECT simto.id, simto.user_id, simto.fecha, simto.fechaHora, simto.longitud, simto.latitud, simto.accuracy, simto.distancia_qr, simto.status, simto.trampa_id, simto.fenologia, trampas.name FROM simto INNER JOIN trampas ON simto.trampa_id = trampas.id_bit WHERE trampas.campana_id = 7 AND simto.fecha = ? ORDER BY simto.id DESC`;
    const res = await this.db?.query(sql, [fecha]);
    return res?.values ?? [];
  }

  async getCapturaId(id: number): Promise<any[]> {
    const sql = `SELECT trampas.latitud, trampas.longitud, fenologias.name as fenologia, trampas.name as trampa, simto.siembra_id, simto.totalTrampas, simto.totalInsectos, simto.latitud as x, simto.longitud as y, simto.id, simto.status FROM simto INNER JOIN trampas ON simto.trampa_id = trampas.id_bit LEFT JOIN fenologias ON simto.fenologia = fenologias.id LEFT JOIN simto_detalle ON simto_detalle.id_simto = simto.id WHERE simto.id = ? AND fenologias.campana_id = 7 LIMIT 1`;
    const res = await this.db?.query(sql, [id]);
    return res?.values ?? [];
  }

  async sqliteSequence(): Promise<number> {
    const sql = `SELECT MAX(seq) as seq FROM sqlite_sequence WHERE name='simto'`;
    const res = await this.db?.query(sql, []);
    if (res?.values?.length && res.values[0]?.seq != null) {
      return res.values[0].seq;
    } else {
      return 0;
    }
  }

  async insert(data: CapturaSimto): Promise<number> {
    const { values } = buildInsertPayloads(data);
    console.log('valores del insert: ', values);
    const sql = `
      INSERT INTO simto(
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
        totalTrampas,
        totalInsectos,
        fenologia
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    try {
      const result = await this.db?.run(sql, values);
      const lastId = result?.changes?.lastId;
      if (lastId !== undefined) {
        return lastId;
      } else {
        console.warn('No se obtuvo lastId tras la inserción');
        return 0;
      }
    } catch (error) {
      console.error('Error al insertar muestreo:', error);
      return 0;
    }
  }

  async update(data: CapturaSimto): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simto';
    const { params, values } = buildUpdatePayloads(data);

    const sql = `
      UPDATE simto SET
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
        totalTrampas = ?,
        totalInsectos = ?,
        fenologia = ?
      WHERE id = ?`;

    try {
      // Actualizar registro localmente
      await this.db?.run(sql, values);

      // Obtener el registro actualizado (muestreo)
      const muestreoRes = await this.db?.query(
        'SELECT * FROM simto WHERE id = ?',
        [data.captura.id],
      );
      const muestreo = muestreoRes?.values ?? [];

      // Obtener detalles relacionados
      const detalleRes = await this.db?.query(
        'SELECT * FROM simto_detalle WHERE id_simto = ?',
        [data.captura.id],
      );
      const detalleRows = detalleRes?.values ?? [];

      // Preparar arrays para el payload
      const pt_ind: number[] = [];
      const pt_lon: number[] = [];
      const pt_lan: number[] = [];
      const pt_acc: number[] = [];
      const pt_dist: number[] = [];
      const pt_insectos: any[] = [];

      detalleRows.forEach((row, index) => {
        pt_ind.push(index + 1);
        pt_lon.push(row.longitud);
        pt_lan.push(row.latitud);
        pt_acc.push(row.accuracy);
        pt_dist.push(row.distancia_qr);
        pt_insectos.push(row.captura);
      });

      // Construir payload con toda la info
      const payload = {
        ...params, // para actualizar en algun momento
        muestreo,
        pt_ind: pt_ind.join(','),
        pt_lon: pt_lon.join(','),
        pt_lan: pt_lan.join(','),
        pt_acc: pt_acc.join(','),
        pt_dist: pt_dist.join(','),
        pt_insectos: pt_insectos.join(','),
      };

      // Enviar al servidor
      const response: ApiResponse = await lastValueFrom(
        this.http.post<ApiResponse>(url, payload),
      );

      if (response.status === 'success' || response.status === 'warning') {
        // Actualizar status local a 1 (enviado)
        const updateSimto = 'UPDATE simto SET status = 1 WHERE id = ?';
        const updateDetail =
          'UPDATE simto_detalle SET status = 1 WHERE id_simto = ?';

        await this.db?.run(updateSimto, [data.captura.id]);
        await this.db?.run(updateDetail, [data.captura.id]);

        return {
          status: response.status,
          message: response.message ?? 'Captura actualizada correctamente',
        };
      }
      // Si no fue éxito ni warning, retornar error con mensaje del servidor
      return {
        status: 'error',
        message:
          response.message ?? 'No se pudo actualizar la captura en el servidor',
      };
    } catch (error: any) {
      console.error('Error actualizando captura:', error);

      // En caso de error, marcar status = 2 (error local)
      try {
        const updateSimto = 'UPDATE simto SET status = 2 WHERE id = ?';
        const updateDetail =
          'UPDATE simto_detalle SET status = 2 WHERE id_simto = ?';
        await this.db?.run(updateSimto, [data.captura.id]);
        await this.db?.run(updateDetail, [data.captura.id]);
      } catch (err) {
        console.error('Error marcando estado de error local:', err);
      }

      return {
        status: 'error',
        message: error?.message ?? 'Error desconocido al guardar la captura',
      };
    }
  }

  async subir(): Promise<any> {
    const url = environment.APIUrl + 'trampeo/captura/simto';
    try {
      // Obtener capturas con status = 2
      const query = 'SELECT * FROM simto WHERE status = 2 ORDER BY id ASC';
      const res = await this.db?.query(query);
      const capturas = res?.values ?? [];

      for (const captura of capturas) {
        try {
          // Obtener detalles relacionados
          const detalleRes = await this.db?.query(
            'SELECT * FROM simto_detalle WHERE id_simto = ?',
            [captura.id],
          );
          const detalleRows = detalleRes?.values ?? [];

          // Preparar arrays para el payload
          const pt_ind: number[] = [];
          const pt_lon: number[] = [];
          const pt_lan: number[] = [];
          const pt_acc: number[] = [];
          const pt_dist: number[] = [];
          const pt_insectos: any[] = [];

          detalleRows.forEach((row, index) => {
            pt_ind.push(index + 1);
            pt_lon.push(row.longitud);
            pt_lan.push(row.latitud);
            pt_acc.push(row.accuracy);
            pt_dist.push(row.distancia_qr);
            pt_insectos.push(row.captura);
          });

          // Construir payload
          const payload = {
            muestreo: captura, // Enviar toda la fila principal
            pt_ind: pt_ind.join(','),
            pt_lon: pt_lon.join(','),
            pt_lan: pt_lan.join(','),
            pt_acc: pt_acc.join(','),
            pt_dist: pt_dist.join(','),
            pt_insectos: pt_insectos.join(','),
          };

          // Enviar al servidor
          const response: any = await lastValueFrom(
            this.http.post(url, payload),
          );

          if (response.status === 'success' || response.status === 'warning') {
            // Actualizar status local
            const updateSimto = 'UPDATE simto SET status = 1 WHERE id = ?';
            const updateDetail =
              'UPDATE simto_detalle SET status = 1 WHERE id_simto = ?';
            await this.db?.run(updateSimto, [captura.id]);
            await this.db?.run(updateDetail, [captura.id]);
          } else {
            console.error('Error en respuesta del servidor:', response);
          }
        } catch (httpError) {
          console.error('Error al enviar captura:', httpError);

          // Marcar como error local
          const updateSimto = 'UPDATE simto SET status = 2 WHERE id = ?';
          const updateDetail =
            'UPDATE simto_detalle SET status = 2 WHERE id_simto = ?';
          await this.db?.run(updateSimto, [captura.id]);
          await this.db?.run(updateDetail, [captura.id]);
        }
      }

      return { status: 'success', message: 'Capturas subidas correctamente' };
    } catch (dbError) {
      console.error('Error al leer de la base de datos:', dbError);
      throw dbError;
    }
  }

  async reenviar(id: number): Promise<ApiResponse> {
    const url = environment.APIUrl + 'trampeo/captura/simto';

    try {
      // Obtener el registro
      const muestreoRes = await this.db?.query(
        'SELECT * FROM simto WHERE id = ?',
        [id],
      );
      const muestreo = muestreoRes?.values ?? [];

      // Obtener detalles relacionados
      const detalleRes = await this.db?.query(
        'SELECT * FROM simto_detalle WHERE id_simto = ?',
        [id],
      );
      const detalleRows = detalleRes?.values ?? [];

      // Preparar arrays para el payload
      const pt_ind: number[] = [];
      const pt_lon: number[] = [];
      const pt_lan: number[] = [];
      const pt_acc: number[] = [];
      const pt_dist: number[] = [];
      const pt_insectos: any[] = [];

      detalleRows.forEach((row, index) => {
        pt_ind.push(index + 1);
        pt_lon.push(row.longitud);
        pt_lan.push(row.latitud);
        pt_acc.push(row.accuracy);
        pt_dist.push(row.distancia_qr);
        pt_insectos.push(row.captura);
      });

      // Construir payload con toda la info
      const payload = {
        //...params, // para actualizar en algun momento
        muestreo,
        pt_ind: pt_ind.join(','),
        pt_lon: pt_lon.join(','),
        pt_lan: pt_lan.join(','),
        pt_acc: pt_acc.join(','),
        pt_dist: pt_dist.join(','),
        pt_insectos: pt_insectos.join(','),
      };

      // Enviar al servidor
      const response: ApiResponse = await lastValueFrom(
        this.http.post<ApiResponse>(url, payload),
      );

      if (response.status === 'success' || response.status === 'warning') {
        // Actualizar status local a 1 (enviado)
        const updateSimto = 'UPDATE simto SET status = 1 WHERE id = ?';
        const updateDetail =
          'UPDATE simto_detalle SET status = 1 WHERE id_simto = ?';

        await this.db?.run(updateSimto, [id]);
        await this.db?.run(updateDetail, [id]);

        return {
          status: response.status,
          message: response.message ?? 'Captura actualizada correctamente',
        };
      }
      // Si no fue éxito ni warning, retornar error con mensaje del servidor
      return {
        status: 'error',
        message:
          response.message ?? 'No se pudo actualizar la captura en el servidor',
      };
    } catch (error: any) {
      console.error('Error actualizando captura:', error);

      // En caso de error, marcar status = 2 (error local)
      try {
        const updateSimto = 'UPDATE simto SET status = 2 WHERE id = ?';
        const updateDetail =
          'UPDATE simto_detalle SET status = 2 WHERE id_simto = ?';
        await this.db?.run(updateSimto, [id]);
        await this.db?.run(updateDetail, [id]);
      } catch (err) {
        console.error('Error marcando estado de error local:', err);
      }

      return {
        status: 'error',
        message: error?.message ?? 'Error desconocido al guardar la captura',
      };
    }
  }
}
