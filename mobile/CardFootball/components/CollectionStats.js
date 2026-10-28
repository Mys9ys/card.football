// Compact collection stats — Bubble

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BubbleTheme, RARITY_LABELS } from '../theme/bubble';

const RARITY_ORDER = ['common', 'rare', 'epic', 'legendary'];
const POSITION_ORDER = [
  { key: 'attacker', label: 'АТ' },
  { key: 'midfielder', label: 'ПЗ' },
  { key: 'defender', label: 'ЗЩ' },
  { key: 'goalkeeper', label: 'ВР' },
];

const CollectionStats = ({ stats, completion }) => {
  const rarityStats = stats?.statsByRarity?.stats || stats?.stats || {};
  const positionStats = stats?.statsByPosition?.stats || null;
  const collected = completion?.collectedCards || 0;
  const total = completion?.totalCards || 0;
  const percent = Math.min(100, Math.max(0, Number(completion?.completionPercentage) || 0));

  return (
    <View style={styles.container}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Альбом</Text>
        <Text style={styles.progressCount}>
          {collected} / {total}
        </Text>
        <Text style={styles.progressPercent}>{percent}%</Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.chipRow}>
        {RARITY_ORDER.map((key) => {
          const colors = BubbleTheme.rarity[key];
          const count = rarityStats[key] ?? 0;
          return (
            <View
              key={key}
              style={[
                styles.chip,
                { backgroundColor: colors.badge, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.chipLabel, { color: colors.badgeText }]}>
                {RARITY_LABELS[key]}
              </Text>
              <Text style={[styles.chipValue, { color: colors.badgeText }]}>{count}</Text>
            </View>
          );
        })}
      </View>

      {positionStats ? (
        <View style={styles.posRow}>
          {POSITION_ORDER.map(({ key, label }) => (
            <View key={key} style={styles.posItem}>
              <View style={styles.posCircle}>
                <Text style={styles.posLabel}>{label}</Text>
              </View>
              <Text style={styles.posValue}>{positionStats[key] ?? 0}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: BubbleTheme.card,
    borderRadius: BubbleTheme.radius,
    padding: 14,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BubbleTheme.line,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  progressCount: {
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '600',
    color: BubbleTheme.muted,
    flex: 1,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: BubbleTheme.track,
    overflow: 'hidden',
    marginBottom: 12,
  },
  fill: {
    height: '100%',
    backgroundColor: BubbleTheme.barFill,
    borderRadius: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 44,
    minWidth: '46%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 2,
  },
  chipLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  chipValue: {
    fontSize: 15,
    fontWeight: '800',
  },
  posRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  posItem: {
    alignItems: 'center',
    flex: 1,
  },
  posCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BubbleTheme.track,
    borderWidth: 2,
    borderColor: BubbleTheme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  posValue: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '700',
    color: BubbleTheme.muted,
  },
});

export default CollectionStats;
