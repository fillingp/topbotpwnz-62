
import { useState, useEffect } from 'react';

type Platform = 'ios' | 'android' | 'web';

export function usePlatform() {
  const [platform, setPlatform] = useState<Platform>('web');
  
  useEffect(() => {
    const detectPlatform = () => {
      // Detekce zda běžíme v Capacitor
      const isCapacitor = 'Capacitor' in window && (window as any).Capacitor?.isNative;
      
      if (!isCapacitor) {
        return 'web';
      }
      
      // Detekce platformy podle user-agentu
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'ios';
      }
      
      if (/android/.test(userAgent)) {
        return 'android';
      }
      
      return 'web';
    };
    
    setPlatform(detectPlatform() as Platform);
  }, []);
  
  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';
  const isNative = isIOS || isAndroid;
  const isWeb = platform === 'web';
  
  return { platform, isIOS, isAndroid, isNative, isWeb };
}
