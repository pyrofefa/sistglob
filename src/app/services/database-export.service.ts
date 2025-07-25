import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import {
  EmailComposer,
  EmailComposerOptions,
} from '@awesome-cordova-plugins/email-composer/ngx';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DatabaseExportService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);

  constructor(private emailComposer: EmailComposer) {}

  async exportarComoJsonYEnviar() {
    const dbName = environment.database.name;
    let connection: SQLiteDBConnection;

    try {
      // ✅ Validar consistencia de conexiones
      await this.sqlite.checkConnectionsConsistency();

      // ⚠️ isConnection requiere dos parámetros
      const existsResult = await this.sqlite.isConnection(dbName, false);
      if (!existsResult.result) {
        await this.sqlite.createConnection(
          dbName,
          false,
          'no-encryption',
          1,
          false
        );
      }

      // ✅ Recuperar conexión existente
      connection = await this.sqlite.retrieveConnection(dbName, false);
      await connection.open();

      // 🧱 Exportar contenido como JSON
      const json = await connection.exportToJson('full');
      const jsonString = JSON.stringify(json);
      const fileName = `${dbName}_backup_${Date.now()}.json`;

      // 💾 Guardar archivo JSON en Documents
      await Filesystem.writeFile({
        path: fileName,
        data: jsonString,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      const rutaCompleta = `file:///storage/emulated/0/Documents/${fileName}`;

      // 📤 Enviar por correo
      const email: EmailComposerOptions = {
        to: 'tucorreo@ejemplo.com',
        subject: 'Respaldo de base de datos',
        body: 'Adjunto respaldo de la base de datos en formato JSON.',
        attachments: [rutaCompleta],
        isHtml: false,
      };

      this.emailComposer.open(email);
    } catch (error) {
      console.error('Error al exportar base de datos como JSON:', error);
    }
  }

  async exportarDbYEnviar() {
    try {
      const dbName = 'trampeo.db';
      const backupFileName = `trampeo_backup_${Date.now()}.db`;

      // Leer archivo .db desde directorio interno de la app (probablemente protegido)
      const archivo = await Filesystem.readFile({
        path: `databases/${dbName}`,
        directory: Directory.Data, // Esta ruta es donde normalmente está la bd, pero no siempre accesible
      });

      // Guardar copia en Documents para poder compartirla
      await Filesystem.writeFile({
        path: backupFileName,
        data: archivo.data,
        directory: Directory.Documents,
      });

      const fileUri = `file:///storage/emulated/0/Documents/${backupFileName}`;

      // Enviar por email
      const emailOptions: EmailComposerOptions = {
        to: 'destinatario@correo.com',
        subject: 'Backup base de datos SQLite (.db)',
        body: 'Adjunto archivo .db de la base de datos',
        attachments: [fileUri],
        isHtml: false,
      };

      await this.emailComposer.open(emailOptions);
    } catch (error) {
      console.error(
        'No se pudo exportar la base de datos .db, probablemente por permisos o ruta:',
        error
      );
    }
  }
}
