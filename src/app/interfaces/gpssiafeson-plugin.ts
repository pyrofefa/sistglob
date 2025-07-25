export interface GPSSiafesonPlugin {
  requestPermissions(): Promise<{ location: string }>;
  startWatch(): Promise<void>;
  stopWatch(): Promise<void>;
  addListener(
    eventName: 'gpsData',
    callback: (data: {
      latitude: number;
      longitude: number;
      accuracy: number;
      timestamp: number;
      timeSource: 'gps' | 'system';
      bearing: string;
      isMock: boolean;
      isJumpDetected: boolean;
      isSpeedUnrealistic:boolean;
    }) => void,
  ): Promise<{ remove: () => Promise<void> }>; // Ahora devuelve una Promise
}
