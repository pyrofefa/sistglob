export interface DatabaseCopierPlugin {
  copyDatabaseToExternal(options: { dbName: string }): Promise<void>;
  importDatabaseFromExternal(options: { dbName: string }): Promise<void>;
}
