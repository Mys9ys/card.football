// Bubble gold coin — 3 variants; default v1 (football embossed)

import React, { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';

export const COIN_VARIANTS = {
  1: require('../assets/theme/coin-v1.jpg'),
  2: require('../assets/theme/coin-v2.jpg'),
  3: require('../assets/theme/coin-v3.jpg'),
};

let activeCoinVariant = 1;
const listeners = new Set();

export function getActiveCoinVariant() {
  return activeCoinVariant;
}

export function setActiveCoinVariant(variant) {
  if (!COIN_VARIANTS[variant] || variant === activeCoinVariant) return;
  activeCoinVariant = variant;
  listeners.forEach((fn) => fn(variant));
}

const CoinIcon = ({ size = 18, variant, style }) => {
  const [active, setActive] = useState(activeCoinVariant);
  useEffect(() => {
    const onChange = (next) => setActive(next);
    listeners.add(onChange);
    return () => listeners.delete(onChange);
  }, []);
  const source = COIN_VARIANTS[variant ?? active] || COIN_VARIANTS[1];
  return (
    <Image
      source={source}
      style={[
        styles.coin,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
      resizeMode="cover"
      accessibilityLabel="монета"
    />
  );
};

const styles = StyleSheet.create({
  coin: {
    overflow: 'hidden',
  },
});

export default CoinIcon;
