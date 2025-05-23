
import { createRoot } from 'react-dom/client'
import { App as CapApp } from '@capacitor/app';
import { SplashScreen } from '@capacitor/splash-screen';
import App from './App.tsx'
import './index.css'

// Funkce pro inicializaci Capacitor pluginů
const initializeCapacitor = () => {
  // Přidá posluchač pro tlačítko zpět na Androidu
  CapApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      CapApp.exitApp();
    } else {
      window.history.back();
    }
  });

  // Skryje úvodní obrazovku po načtení
  SplashScreen.hide();
};

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Vykreslení aplikace
createRoot(document.getElementById("root")!).render(<App />);

// Inicializace Capacitor pro mobilní platformy
document.addEventListener('DOMContentLoaded', () => {
  // Kontrola, zda jsme na Capacitor platformě
  const isCapacitorPlatform = 
    window.Capacitor !== undefined && 
    (window.Capacitor.isNativePlatform?.() || window.Capacitor.isNative);
    
  if (isCapacitorPlatform) {
    initializeCapacitor();
    console.log('Capacitor initialized');
  }
});
