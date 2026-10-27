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
  if (document.getElementById(FRAME_CSS_ID)) {
    return;
  }
  const style = document.createElement('style');
  style.id = FRAME_CSS_ID;
  style.textContent = `
    html, body, #root {
      height: 100%;
      margin: 0;
    }
    body {
      background: #B8D4E8;
    }
    #root {
      display: flex;
      justify-content: center;
      align-items: stretch;
      min-height: 100%;
      background: #B8D4E8;
    }
    #root > div {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: ${PHONE_MAX_WIDTH}px;
      height: 100vh;
      max-height: 100vh;
      background: #DFF6FF;
      box-shadow: 0 0 40px rgba(42, 33, 80, 0.18);
      overflow: hidden;
      position: relative;
    }
    #root > div > div {
      flex: 1;
      min-height: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `;
  document.head.appendChild(style);
}

export default function App() {
  useEffect(() => {
    installWebPhoneFrame();
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
