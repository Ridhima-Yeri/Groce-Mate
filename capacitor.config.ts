import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.grocemate.app',
  appName: 'GroceMate',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#FFFFFF',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small'
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#FFFFFF'
    }
  },
  ios: {
    contentInset: 'always'
  },
  android: {
    captureInput: true,
    allowMixedContent: true
  }
};

export default config;
