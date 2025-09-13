import { isPlatform } from '@ionic/react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';

export const isNativePlatform = () => Capacitor.isNativePlatform();
export const isIOS = () => isPlatform('ios');
export const isAndroid = () => isPlatform('android');

export const initializePlatform = async () => {
  // Handle hardware back button
  App.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      App.exitApp();
    } else {
      window.history.back();
    }
  });

  // Configure status bar
  if (isNativePlatform()) {
    try {
      await StatusBar.setStyle({ style: isIOS() ? Style.Dark : Style.Light });
      if (isAndroid()) {
        await StatusBar.setBackgroundColor({ color: '#ffffff' });
      }
    } catch (error) {
      console.error('Error configuring StatusBar:', error);
    }
  }
};

// Platform-specific style utility
export const getPlatformSpecificStyle = (
  iosStyle: any,
  androidStyle: any,
  defaultStyle: any = {}
) => {
  if (isIOS()) return { ...defaultStyle, ...iosStyle };
  if (isAndroid()) return { ...defaultStyle, ...androidStyle };
  return defaultStyle;
};
