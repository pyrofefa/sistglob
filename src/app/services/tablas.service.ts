import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TablasService {
  private db: SQLiteDBConnection | null = null;

  fenologias: any = [];
  observaciones: any = [];
  brotes: any = [];
  trampas: any = [];
  recomendaciones: any = [];
  acciones: any = [];
  omisiones: any = [];
  capturas: any = [];

  nombre$ = new EventEmitter<string>();

  constructor(public http: HttpClient) {}

  setDatabase(db: SQLiteDBConnection) {
    this.db = db;
  }

  // Función genérica para operaciones de las tablas de los catalogos
  private async syncTableData(
    endpoint: string,
    tableName: string,
    dataKey: string,
    insertSql: string,
    columns: string[]
  ): Promise<any> {
    try {
      const data: any = await lastValueFrom(
        this.http.get(environment.APIUrl + endpoint)
      );

      if (data?.status !== 'success') {
        return data;
      }

      // Borrar datos existentes
      await this.db?.execute(`DELETE FROM ${tableName}`);

      // Insertar nuevos registros
      const items = data[dataKey];
      for (const item of items) {
        const values = columns.map((col) => item[col]);
        await this.db?.run(insertSql, values);
      }

      return data;
    } catch (error) {
      console.error(`Error syncing ${tableName}:`, error);
      return error;
    }
  }

  async getServicesTablas(): Promise<any> {
    return this.syncTableData(
      'trampeo/fenologias',
      'fenologias',
      'fenologias',
      'INSERT INTO fenologias(id, name, orden, id_sicafi, id_sicafison, status, campana_id, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'id_bit',
        'name',
        'orden',
        'id_sicafi',
        'id_sicafison',
        'status',
        'campana_id',
        'created',
      ]
    );
  }

  async getServicesBrotes(): Promise<any> {
    return this.syncTableData(
      'trampeo/fenologias/brotes',
      'brotes',
      'brotes',
      'INSERT INTO brotes(id, name, orden, id_sicafi, id_sicafison, status, campana_id, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'id',
        'name',
        'orden',
        'id_sicafi',
        'id_sicafison',
        'status',
        'campana_id',
        'created',
      ]
    );
  }

  async getServicesObservaciones(): Promise<any> {
    return this.syncTableData(
      'trampeo/observaciones',
      'observaciones',
      'observaciones',
      'INSERT INTO observaciones(id, name, orden, id_sicafi, id_sicafison, status, campana_id, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'id',
        'name',
        'orden',
        'id_sicafi',
        'id_sicafison',
        'status',
        'campana_id',
        'created',
      ]
    );
  }

  async getServicesRecomendaciones(): Promise<any> {
    return this.syncTableData(
      'trampeo/recomendaciones',
      'recomendaciones',
      'recomendaciones',
      'INSERT INTO recomendaciones(id, name, orden, id_sicafi, id_sicafison, status, campana_id, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'id_bit',
        'name',
        'orden',
        'id_sicafi',
        'id_sicafison',
        'status',
        'campana_id',
        'created',
      ]
    );
  }

  async getServicesAcciones(): Promise<any> {
    return this.syncTableData(
      'trampeo/acciones',
      'acciones',
      'acciones',
      'INSERT INTO acciones(id, name, orden, id_sicafi, id_sicafison, status, campana_id, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'id',
        'name',
        'orden',
        'id_sicafi',
        'id_sicafison',
        'status',
        'campana_id',
        'created',
      ]
    );
  }

  async getServicesOmisiones(): Promise<any> {
    return this.syncTableData(
      'trampeo/omisiones',
      'omisiones',
      'omisiones',
      'INSERT INTO omisiones(id, name, orden, id_sicafi, id_sicafison, status, campana_id, created) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        'id',
        'name',
        'orden',
        'id_sicafi',
        'id_sicafison',
        'status',
        'campana_id',
        'created',
      ]
    );
  }

  async getServiceUbicaciones(id: any, junta: any): Promise<any> {
    try {
      const data: any = await lastValueFrom(
        this.http.get(environment.APIUrl + `trampeo/ubicaciones/${id}/${junta}`)
      );

      if (data?.status !== 'success') {
        return data;
      }

      await this.db?.execute('DELETE FROM trampas');

      const trampas = data.data;
      for (const trampa of trampas) {
        const sql = `INSERT INTO trampas(
        id_bit, name, status, latitud, longitud, superficie,
        id_sicafi, campo, productor, variedad_id, campana_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
          trampa.id_bit,
          trampa.name,
          trampa.status,
          trampa.latitud,
          trampa.longitud,
          trampa.superficie,
          trampa.id_sicafi,
          trampa.campo,
          trampa.productor,
          trampa.variedad_id,
          trampa.campana_id,
        ];

        await this.db?.run(sql, values);
      }

      return data;
    } catch (error) {
      console.error('Error syncing ubicaciones:', error);
      return error;
    }
  }
  async getSimtrampeo(personal_id: any, junta_id: any): Promise<any> {
  try {
    const params = { personal_id, junta_id };
    const data: any = await lastValueFrom(
      this.http.post(environment.APIUrl + 'trampeo/simtrampeo/capturas', params)
    );

    if (data?.status !== 'success') {
      return data;
    }

    const capturas = data.capturas;
    for (const captura of capturas) {
      // USAR QUERY PARA SELECT
      const checkSql = `SELECT * FROM simtrampeo
                       WHERE trampa_id = ? AND ano = ? AND semana = ? AND status = 3`;

      const res = await this.db?.query(checkSql, [
        captura.trampa_id,
        captura.ano,
        captura.semana
      ]);

      if (res?.values && res.values.length > 0) {
        // Actualizar registro existente - USAR RUN
        const updateSql = `UPDATE simtrampeo SET
          junta_id = ?, personal_id = ?, user_id = ?, fecha = ?, fechaHora = ?,
          longitud_ins = ?, latitud_ins = ?, longitud_rev = ?, latitud_rev = ?,
          accuracy = ?, distancia_qr = ?, status = ?, trampa_id = ?,
          fecha_instalacion = ?, captura = ?, ano = ?, semana = ?, id_bd_cel = ?
          WHERE id_bit = ?`;

        await this.db?.run(updateSql, [
          captura.junta_id,
          captura.personal_id,
          captura.user_id,
          captura.fecha,
          captura.fechaHora,
          captura.longitud_ins,
          captura.latitud_ins,
          captura.longitud_rev,
          captura.latitud_rev,
          captura.accuracy,
          captura.distancia_qr,
          captura.status,
          captura.trampa_id,
          captura.fecha_instalacion,
          captura.captura,
          captura.ano,
          captura.semana,
          captura.id_bd_cel,
          captura.id_bit
        ]);
      } else {
        // Insertar nuevo registro - USAR RUN
        const insertSql = `INSERT INTO simtrampeo (
          junta_id, personal_id, user_id, fecha, fechaHora,
          longitud_ins, latitud_ins, longitud_rev, latitud_rev,
          accuracy, distancia_qr, status, trampa_id,
          fecha_instalacion, captura, ano, semana, id_bd_cel, siembra_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await this.db?.run(insertSql, [
          captura.junta_id,
          captura.personal_id,
          captura.user_id,
          captura.fecha,
          captura.fechaHora,
          captura.longitud_ins,
          captura.latitud_ins,
          captura.longitud_rev,
          captura.latitud_rev,
          captura.accuracy,
          captura.distancia_qr,
          captura.status,
          captura.trampa_id,
          captura.fecha_instalacion,
          captura.captura,
          captura.ano,
          captura.semana,
          captura.id_bd_cel,
          captura.id_bit
        ]);
      }
    }

    return data;
  } catch (error) {
    console.error('Error syncing simtrampeo:', error);
    return error;
  }
}
}
