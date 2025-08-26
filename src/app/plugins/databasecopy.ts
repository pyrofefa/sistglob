import { registerPlugin } from '@capacitor/core';
import { DatabaseCopierPlugin } from 'src/app/interfaces/database-copier-plugin';

// Plugin personalizado para copiar base de datos
export const DatabaseCopier = registerPlugin<DatabaseCopierPlugin>('CopyFileSiafeson');
