import { Preferences } from '@capacitor/preferences';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { TablasService } from './tablas.service';
import { InfoService } from './info.service';
import { TrampasService } from './trampas.service';
import { FenologiasService } from './fenologias.service';
import { BrotesService } from './brotes.service';
import { ObservacionesService } from './observaciones.service';
import { RecomendacionesService } from './recomendaciones.service';
import { AccionesService } from './acciones.service';
import { OmisionesService } from './omisiones.service';
import { SimepService } from './simep.service';
import { SimgbnService } from './simgbn.service';
import { SimdiaService } from './simdia.service';
import { SimppService } from './simpp.service';
import { SimmoscasService } from './simmoscas.service';
import { SimtrampeoService } from './simtrampeo.service';
import { SimtoService } from './simto.service';
import { SimtoDetalleService } from './simto-detalle.service';
import { SimpicudoService } from './simpicudo.service';
import { MigrationService } from './migration.service';
import { Capacitor } from '@capacitor/core';
import { ErrorLogService } from './error-log.service';
import { DatabaseCopier } from 'src/app/plugins/databasecopy';

const MIGRATION_FLAG_KEY = 'db-migrated-v1';

@Injectable({ providedIn: 'root' })
export class DatabaseInitService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  constructor(
    private tabla: TablasService,
    private info: InfoService,
    private trampas: TrampasService,
    private fenologias: FenologiasService,
    private brotes: BrotesService,
    private observaciones: ObservacionesService,
    private recomendaciones: RecomendacionesService,
    private acciones: AccionesService,
    private omisiones: OmisionesService,
    private simep: SimepService,
    private simgbn: SimgbnService,
    private simdia: SimdiaService,
    private simpp: SimppService,
    private simmoscas: SimmoscasService,
    private simtrampeo: SimtrampeoService,
    private simto: SimtoService,
    private simto_detalle: SimtoDetalleService,
    private simpicudo: SimpicudoService,
    private migration: MigrationService,
    private error_logs: ErrorLogService
  ) {}

  async initializeDatabase() {
    try {
      // ⚠️ Intentar migrar si nunca se hizo
      await this.tryMigrateOldDatabase();

      const dbConfig = environment.database;

       const connection = await this.sqlite.createConnection(dbConfig.name, false, 'no-encryption', 1, false);
       await connection.open();

      const serviciosConDB = [
        this.tabla, this.info, this.trampas, this.fenologias, this.brotes, this.observaciones,
        this.recomendaciones, this.acciones, this.omisiones,
        this.simep, this.simgbn, this.simdia, this.simpp,
        this.simmoscas, this.simtrampeo, this.simto, this.simto_detalle, this.simpicudo, this.error_logs
      ];
      for (const servicio of serviciosConDB) {
        servicio.setDatabase(connection);
      }

      await this.crearTablas();
      await this.migration.aplicarMigraciones(connection);

    } catch (error) {
      console.error('❌ Error creando la base de datos:', error);
    }
  }

  private async crearTablas() {
    const tareas = [
      { nombre: 'info', fn: () => this.info.createTable() },
      { nombre: 'trampas', fn: () => this.trampas.createTable() },
      { nombre: 'fenologias', fn: () => this.fenologias.createTable() },
      { nombre: 'brotes', fn: () => this.brotes.createTable() },
      { nombre: 'observaciones', fn: () => this.observaciones.createTable() },
      { nombre: 'recomendaciones', fn: () => this.recomendaciones.createTable() },
      { nombre: 'acciones', fn: () => this.acciones.createTable() },
      { nombre: 'omisiones', fn: () => this.omisiones.createTable() },
      { nombre: 'simep', fn: () => this.simep.createTable() },
      { nombre: 'simgbn', fn: () => this.simgbn.createTable() },
      { nombre: 'simpp', fn: () => this.simpp.createTable() },
      { nombre: 'simdia', fn: () => this.simdia.createTable() },
      { nombre: 'simmoscas', fn: () => this.simmoscas.createTable() },
      { nombre: 'simtrampeo', fn: () => this.simtrampeo.createTable() },
      { nombre: 'simto', fn: () => this.simto.createTable() },
      { nombre: 'simto_detalle', fn: () => this.simto_detalle.createTable() },
      { nombre: 'simpicudo', fn: () => this.simpicudo.createTable() },
      { nombre: 'error_logs', fn: () => this.error_logs.createTable() }
    ];

    for (const tarea of tareas) {
      try {
        await tarea.fn();
      } catch (err) {
        console.error(`❌ Error creando tabla "${tarea.nombre}":`, err);
      }
    }
  }

  // ✅ Migrar la base de datos de cordova a capacitor
  private async tryMigrateOldDatabase() {
    const { value } = await Preferences.get({ key: MIGRATION_FLAG_KEY });

    if (value === 'true') {
      return;
    }

    if (Capacitor.getPlatform() !== 'android') {
      console.warn('⚠️ Migración solo soportada en Android');
      return;
    }

    try {
      const dbName = environment.database.name;
      await DatabaseCopier.importDatabaseFromExternal({ dbName });

      await Preferences.set({ key: MIGRATION_FLAG_KEY, value: 'true' });
    } catch (error) {
      console.log('❌ Error durante la migración de base de datos:'+ error);
    }
  }
}
