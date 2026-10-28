// Shop pack tile — art with price / count overlays, (i) for details

import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Animated,
} from 'react-native';
import { BubbleTheme, RARITY_LABELS } from '../theme/bubble';
import CoinIcon from './CoinIcon';

const TIER_BY_PACK = {
  starter: 'common',
  standard: 'rare',
  premium: 'epic',
  defense_pack: 'epic',
  legendary: 'legendary',
  golden_legends: 'legendary',
};

const PACK_ART = {
  common: require('../assets/theme/pack-common.jpg'),
  rare: require('../assets/theme/pack-rare.jpg'),
  epic: require('../assets/theme/pack-epic.jpg'),
  legendary: require('../assets/theme/pack-legendary.jpg'),
};

const GUARANTEE_LABEL = {
  legendary: 'легенда',
  epic: 'эпик',
  rare: 'редкая',
};

export const TIER_ORDER = ['legendary', 'epic', 'rare', 'common'];

export const TIER_TAB_LABELS = {
  legendary: 'Легенд',
  epic: 'Эпик',
  rare: 'Редк',
  common: 'Обычн',
};

export function getPackTier(packId) {
  return TIER_BY_PACK[packId] || 'common';
}

export function getPackArt(packId) {
  return PACK_ART[getPackTier(packId)] || PACK_ART.common;
}

export function getPackGuarantee(pack) {
  if (pack.guaranteedLegendary) return GUARANTEE_LABEL.legendary;
  if (pack.guaranteedEpic) return GUARANTEE_LABEL.epic;
  if (pack.guaranteedRare) return GUARANTEE_LABEL.rare;
  return null;
}

export function getPackInfoLines(pack) {
  const tier = getPackTier(pack.id);
  const legendaryChance = pack.rarityWeights?.legendary ?? 0;
  const guarantee = getPackGuarantee(pack);
  const lines = [
    pack.name,
    `${pack.cardsCount} карт`,
    pack.price === 0 ? 'Бесплатно' : `${pack.price} монет`,
    `Шанс легенды: ${legendaryChance}%`,
    `Тир: ${RARITY_LABELS[tier]}`,
  ];
  if (guarantee) lines.push(`Гарантия: ${guarantee}`);
  if (pack.description) lines.push(pack.description);
  return lines;
}

/** Compact pack for overlapping shop shelf. Tap = buy/open. (i) = details. */
const PackCard = ({ pack, onPress, onInfoPress, disabled, stackIndex = 0 }) => {
  const tier = getPackTier(pack.id);
  const colors = BubbleTheme.rarity[tier];
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (to) => {
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      friction: 6,
      tension: 160,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.stackItem,
        {
          zIndex: 20 - stackIndex,
          marginLeft: stackIndex === 0 ? 0 : -42,
          transform: [{ scale }],
        },
        disabled && styles.disabled,
      ]}
    >
      <View style={[styles.packFrame, { borderColor: colors.border }]}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          onPressIn={() => animateTo(0.96)}
          onPressOut={() => animateTo(1)}
          accessibilityRole="button"
          accessibilityLabel={`Купить ${pack.name}, ${pack.price === 0 ? 'бесплатно' : `${pack.price} монет`}`}
          style={styles.packHit}
        >
          <Image
            source={getPackArt(pack.id)}
            style={styles.packArt}
            resizeMode="cover"
          />

          <View style={styles.pricePill} pointerEvents="none">
            {pack.price === 0 ? (
              <Text style={styles.priceText}>FREE</Text>
            ) : (
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{pack.price}</Text>
                <CoinIcon size={16} />
              </View>
            )}
          </View>

          <View style={styles.countBadge} pointerEvents="none">
            <Text style={styles.countText}>{pack.cardsCount} карт</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => onInfoPress?.(pack)}
          hitSlop={8}
          style={styles.infoBtn}
          accessibilityRole="button"
          accessibilityLabel={`Информация: ${pack.name}`}
        >
          <Text style={styles.infoBtnText}>i</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  stackItem: {
    width: 132,
  },
  disabled: {
    opacity: 0.45,
  },
  packFrame: {
    width: 132,
    height: 176,
    borderRadius: 20,
    borderWidth: 3,
    overflow: 'hidden',
    backgroundColor: BubbleTheme.card,
    position: 'relative',
  },
  packHit: {
    flex: 1,
  },
  packArt: {
    width: '100%',
    height: '100%',
  },
  pricePill: {
    position: 'absolute',
    top: 8,
    left: 8,
    minHeight: 28,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: BubbleTheme.coinBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceText: {
    color: BubbleTheme.coin,
    fontSize: 13,
    fontWeight: '900',
  },
  countBadge: {
    position: 'absolute',
    bottom: 10,
    left: 8,
    right: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(42, 33, 80, 0.72)',
    alignItems: 'center',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  infoBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 247, 251, 0.95)',
    borderWidth: 2,
    borderColor: BubbleTheme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: BubbleTheme.text,
    fontStyle: 'italic',
  },
});

export default PackCard;
