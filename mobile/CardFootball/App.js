import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import RootNavigator from './navigation/RootNavigator';

const PHONE_MAX_WIDTH = 390;
const FRAME_CSS_ID = 'cf-phone-frame-css';

function installWebPhoneFrame() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') {
    return;
  }
  let style = document.getElementById(FRAME_CSS_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = FRAME_CSS_ID;
    document.head.appendChild(style);
  }
  style.textContent = `
    html, body, #root {
      height: 100%;
      height: 100dvh;
      margin: 0;
      overflow: hidden;
    }
    body {
      background: #B8D4E8;
    }
    #root {
      display: flex;
      justify-content: center;
      align-items: stretch;
      min-height: 100%;
      min-height: 100dvh;
      background: #B8D4E8;
    }
    #root > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: ${PHONE_MAX_WIDTH}px;
      height: 100%;
      height: 100dvh;
      max-height: 100%;
      max-height: 100dvh;
      background: #DFF6FF;
      box-shadow: 0 0 40px rgba(42, 33, 80, 0.18);
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
    }
    [role="tablist"] {
      box-sizing: border-box !important;
      overflow: visible !important;
    }
    [role="tab"], [role="tab"] div {
      overflow: visible !important;
    }
    #root > div > div {
      flex: 1;
      min-height: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `;
}

function syncVisualViewportHeight() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return undefined;
  }
  const apply = () => {
    const h = window.visualViewport?.height || window.innerHeight;
    document.documentElement.style.setProperty('--cf-frame-h', `${Math.floor(h)}px`);
    const frame = document.querySelector('#root > div');
    if (frame) {
      frame.style.height = `${Math.floor(h)}px`;
      frame.style.maxHeight = `${Math.floor(h)}px`;
    }
  };
  apply();
  window.visualViewport?.addEventListener('resize', apply);
  window.addEventListener('resize', apply);
  return () => {
    window.visualViewport?.removeEventListener('resize', apply);
    window.removeEventListener('resize', apply);
  };
}

export default function App() {
  useEffect(() => {
    installWebPhoneFrame();
    return syncVisualViewportHeight();
  }, []);

  return (
    <View style={styles.phone}>
      <RootNavigator />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  phone: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#DFF6FF',
    overflow: 'hidden',
  },
});
