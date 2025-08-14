import { Injectable } from '@angular/core';
import { SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class MigrationService {
  private readonly SCHEMA_VERSION = 4;

  async aplicarMigraciones(connection: SQLiteDBConnection): Promise<void> {
    const stored = await Preferences.get({ key: 'schema_version' });
    const storedVersion = Number(stored.value || 1);

    if (storedVersion < this.SCHEMA_VERSION) {
      console.log(`🔄 Migrando BD de versión ${storedVersion} a ${this.SCHEMA_VERSION}`);
      if (storedVersion < 2) await this.migracionV2(connection);
      if (storedVersion < 3) await this.migracionV3(connection);
      if (storedVersion < 4) await this.migracionV4(connection);

      await Preferences.set({ key: 'schema_version', value: this.SCHEMA_VERSION.toString() });
    } else {
      console.log('✅ Base de datos ya actualizada');
    }
  }

  private async migracionV2(connection: SQLiteDBConnection): Promise<void> {
    const tablas = [
      'simep', 'simgbn', 'simdia', 'simpp',
      'simmoscas', 'simtrampeo', 'simto', 'simto_detalle', 'simpicudo'
    ];

    for (const tabla of tablas) {
      await this.agregarCampoSiNoExiste(connection, tabla, 'version', 'TEXT', "''");
    }
  }

  //agregando campo actividad y cambio de feromona
  private async migracionV3(connection: SQLiteDBConnection): Promise<void> {
    const tablas = [
     'simpicudo', 'simpp', 'simtrampeo', 'simgbn'
    ];

    for (const tabla of tablas) {
      await this.agregarCampoSiNoExiste(connection, tabla, 'feromona', 'INTERGER', "''");
      await this.agregarCampoSiNoExiste(connection, tabla, 'accion', 'INTERGER', "''");
    }
  }

  //agregando campo fenologia
  private async migracionV4(connection: SQLiteDBConnection): Promise<void> {
    const tablas = [
     'simpicudo', 'simmoscas'
    ];

    for (const tabla of tablas) {
      await this.agregarCampoSiNoExiste(connection, tabla, 'fenologia', 'INTERGER', "''");
    }
  }

  private async agregarCampoSiNoExiste(
    connection: SQLiteDBConnection,
    tabla: string,
    campo: string,
    tipo: string,
    defaultValue: string = "''"
  ): Promise<void> {
    try {
      const res = await connection.query(`PRAGMA table_info(${tabla});`);
      const columnas = res.values?.map(c => c.name) ?? [];

      if (!columnas.includes(campo)) {
        const sql = `ALTER TABLE ${tabla} ADD COLUMN ${campo} ${tipo} DEFAULT ${defaultValue};`;
        await connection.execute(sql);
        console.log(`🆕 Campo "${campo}" agregado en "${tabla}"`);
      } else {
        console.log(`✔️ Campo "${campo}" ya existe en "${tabla}"`);
      }
    } catch (error) {
      console.error(`❌ Error en alteración de tabla "${tabla}":`, error);
    }
  }
}
