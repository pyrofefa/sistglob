import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Preferences } from '@capacitor/preferences';
import { FirebaseCrashlytics } from '@capacitor-firebase/crashlytics';

@Injectable({
  providedIn: 'root'
})
export class MigrationSessionService {
  private _storage: Storage | null = null;

  //Claves antiguas
  private readonly KEYS = [
    'auth-token-sistglob',
    'personal-token-sistglob',
    'junta-token-sistglob',
    'tipo-token'
  ];

  constructor() {
    this.init();
  }
  async init() {
    const storage = new Storage();
    this._storage = await storage.create();
  }

  async migrateSession(): Promise<void> {
    if (!this._storage) return;

    for (const key of this.KEYS) {
      const oldValue = await this._storage.get(key);

      if (oldValue !== null && oldValue !== undefined) {
        const { value } = await Preferences.get({ key });

        if (!value) {
          await Preferences.set({
            key,
            value: typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue),
          });
          await FirebaseCrashlytics.log({ message: `✅ Migrado: ${key}` });
          console.log(`✅ Migrado: ${key}`);
        } else {
          await FirebaseCrashlytics.log({ message: `ℹ️ Ya existe en Preferences: ${key}` });
          console.log(`ℹ️ Ya existe en Preferences: ${key}`);
        }

        // Opcional: eliminar clave vieja
        // await this._storage.remove(key);
      } else {
        await FirebaseCrashlytics.log({ message: `⚠️ No se encontró en Storage: ${key}` });
        console.log(`⚠️ No se encontró en Storage: ${key}`);
      }
    }
  }
}
