import { registerPlugin } from '@capacitor/core';
import { GPSSiafesonPlugin } from 'src/app/interfaces/gpssiafeson-plugin';

// Plugin personalizado para obtener datos GPS
export const GPSSiafeson = registerPlugin<GPSSiafesonPlugin>('GPSSiafeson');
