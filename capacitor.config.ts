
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.9389cd01fa6449e0885f7d53c621ba46',
  appName: 'topbotpwnz-76',
  webDir: 'dist',
  server: {
    url: 'https://9389cd01-fa64-49e0-885f-7d53c621ba46.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#121212",
      showSpinner: true,
      spinnerColor: "#6d28d9",
      androidSpinnerStyle: "large"
    }
  },
  ios: {
    contentInset: "always"
  },
  android: {
    backgroundColor: "#121212"
  }
};

export default config;
