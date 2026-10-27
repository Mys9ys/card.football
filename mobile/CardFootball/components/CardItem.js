// Player collectible card — Bubble («Шарик») direction

import React, { useMemo, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { BubbleTheme, RARITY_LABELS } from '../theme/bubble';

const DEFAULT_PORTRAIT = require('../assets/theme/player-bubble.jpg');

const POSITION_LABELS = {
  attacker: 'АТ',
  midfielder: 'ПЗ',
  defender: 'ЗЩ',
  goalkeeper: 'ВР',
};

const CardItem = ({ card, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const colors = useMemo(() => {
    return BubbleTheme.rarity[card.rarity] || BubbleTheme.rarity.common;
  }, [card.rarity]);

  const overall = useMemo(() => {
    const total =
      (card.attack || 0) +
      (card.defense || 0) +
      (card.speed || 0) +
      (card.technique || 0);
    return Math.round(total / 4);
  }, [card]);

  const positionLabel = POSITION_LABELS[card.position] || '—';
  const rarityLabel = RARITY_LABELS[card.rarity] || RARITY_LABELS.common;

  const imageSource = card.imageLocal
    ? card.imageLocal
    : card.image && typeof card.image === 'number'
      ? card.image
      : DEFAULT_PORTRAIT;

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }], flex: 1 }}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            borderColor: colors.border,
            shadowColor: colors.border,
          },
          card.rarity === 'legendary' && styles.cardLegendary,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
        accessibilityRole="button"
      >
        <View style={[styles.photoWrap, { borderBottomColor: colors.border }]}>
          <Image
            source={imageSource}
            style={styles.photo}
            resizeMode="cover"
          />
          <View style={[styles.ovrRing, { borderColor: colors.border }]}>
            <Text style={styles.ovrText}>{overall}</Text>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.badge,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: colors.badgeText }]}>
              {rarityLabel}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text
            style={[
              styles.name,
              (card.name || '').length > 14 && styles.nameLong,
              (card.name || '').length > 18 && styles.nameLonger,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
          >
            {card.name}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {positionLabel}
          </Text>

          <View style={styles.stats}>
            <StatRow label="АТК" value={card.attack} />
            <StatRow label="ЗАЩ" value={card.defense} />
            <StatRow label="СКР" value={card.speed} />
            <StatRow label="ТЕХ" value={card.technique} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const StatRow = ({ label, value }) => {
  const width = Math.min(100, Math.max(0, Number(value) || 0));
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${width}%` }]} />
      </View>
      <Text style={styles.statValue}>{value ?? 0}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: BubbleTheme.card,
    borderWidth: 3,
    borderRadius: 24,
    margin: 6,
    overflow: 'visible',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 0,
    elevation: 4,
    height: 262,
    minHeight: 262,
    maxHeight: 262,
  },
  cardLegendary: {
    shadowOpacity: 0.28,
  },
  photoWrap: {
    height: 142,
    minHeight: 142,
    maxHeight: 142,
    flexShrink: 0,
    borderBottomWidth: 3,
    overflow: 'hidden',
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    backgroundColor: '#CFF0FF',
  },
  photo: {
    width: '100%',
    height: 142,
  },
  ovrRing: {
    position: 'absolute',
    left: 10,
    bottom: -12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  ovrText: {
    fontSize: 16,
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 2,
    zIndex: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  body: {
    paddingTop: 14,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: BubbleTheme.text,
    lineHeight: 18,
    height: 18,
  },
  nameLong: {
    fontSize: 13,
  },
  nameLonger: {
    fontSize: 11.5,
  },
  meta: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '700',
    color: BubbleTheme.muted,
  },
  stats: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stat: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statLabel: {
    width: 28,
    fontSize: 10,
    fontWeight: '700',
    color: BubbleTheme.muted,
  },
  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: 99,
    backgroundColor: BubbleTheme.track,
    overflow: 'hidden',
    marginHorizontal: 4,
  },
  barFill: {
    height: '100%',
    backgroundColor: BubbleTheme.barFill,
    borderRadius: 99,
  },
  statValue: {
    width: 22,
    fontSize: 11,
    fontWeight: '800',
    color: BubbleTheme.text,
    textAlign: 'right',
  },
});

export default CardItem;
