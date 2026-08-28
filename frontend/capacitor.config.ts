import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.geoshield.app',
  appName: 'GeoShield',
  webDir: 'dist',
  server: {
    // Allow navigation to external URLs (for maps, etc.)
    allowNavigation: ['*'],
    // For development, you can set the backend URL:
    // url: 'http://192.168.1.100:8000',
    // cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0a0f1a',
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;
