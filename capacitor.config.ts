import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.viveearn.app',
  appName: 'Vive Earn',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
