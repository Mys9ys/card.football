// Shop shelf: folder-style tier tabs + overlapping packs

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import PackCard, {
  TIER_ORDER,
  TIER_TAB_LABELS,
  getPackTier,
  getPackInfoLines,
} from './PackCard';
import CoinIcon, {
  getActiveCoinVariant,
  setActiveCoinVariant,
} from './CoinIcon';
import { BubbleTheme } from '../theme/bubble';

const PackShopShelf = ({ packs, disabled, onBuyPack }) => {
  const byTier = useMemo(() => {
    const map = { legendary: [], epic: [], rare: [], common: [] };
    const sorted = [...packs].sort((a, b) => {
      const ta = TIER_ORDER.indexOf(getPackTier(a.id));
      const tb = TIER_ORDER.indexOf(getPackTier(b.id));
      if (ta !== tb) return ta - tb;
      return (b.price || 0) - (a.price || 0);
    });
    sorted.forEach((p) => {
      map[getPackTier(p.id)].push(p);
    });
    return map;
  }, [packs]);

  const availableTabs = useMemo(
    () => TIER_ORDER.filter((tier) => byTier[tier].length > 0),
    [byTier]
  );

  const [activeTier, setActiveTier] = useState(availableTabs[0] || 'legendary');
  const [infoPack, setInfoPack] = useState(null);
  const [coinVariant, setCoinVariant] = useState(getActiveCoinVariant);

  useEffect(() => {
    if (!availableTabs.includes(activeTier) && availableTabs.length) {
      setActiveTier(availableTabs[0]);
    }
  }, [availableTabs, activeTier]);

  const shelfPacks = byTier[activeTier] || [];
  const activeColors = BubbleTheme.rarity[activeTier] || BubbleTheme.rarity.common;

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>Купить пак</Text>
      <Text style={styles.subtitle}>
        Витрина магазина — пак покупается и сразу открывается
      </Text>

      {typeof __DEV__ !== 'undefined' && __DEV__ ? (
        <View style={styles.coinPicker}>
          <Text style={styles.coinPickerLabel}>Монетка (dev):</Text>
          {[1, 2, 3].map((v) => (
            <Pressable
              key={v}
              onPress={() => {
                setActiveCoinVariant(v);
                setCoinVariant(v);
              }}
              style={[
                styles.coinPick,
                coinVariant === v && styles.coinPickActive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Монетка вариант ${v}`}
            >
              <CoinIcon size={28} variant={v} />
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Folder tabs — glued to the page below */}
      <View style={styles.folderBlock}>
        <View style={styles.tabsRow}>
          {TIER_ORDER.map((tier) => {
            const count = byTier[tier]?.length || 0;
            if (!count) return null;
            const active = tier === activeTier;
            const colors = BubbleTheme.rarity[tier];
            return (
              <Pressable
                key={tier}
                onPress={() => setActiveTier(tier)}
                style={[
                  styles.folderTab,
                  {
                    backgroundColor: active ? colors.badge : BubbleTheme.track,
                    borderColor: active ? colors.border : BubbleTheme.line,
                  },
                  active && styles.folderTabActive,
                  active && { zIndex: 3 },
                ]}
                accessibilityRole="tab"
                accessibilityState={{ selected: active }}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: active ? colors.badgeText : BubbleTheme.muted },
                    active && styles.tabTextActive,
                  ]}
                >
                  {TIER_TAB_LABELS[tier]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={[
            styles.shelfWindow,
            {
              borderColor: activeColors.border,
              backgroundColor: activeColors.badge,
            },
          ]}
        >
          {shelfPacks.length === 0 ? (
            <Text style={styles.empty}>В этом тире пока нет паков</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.shelfRow}
            >
              {shelfPacks.map((pack, index) => (
                <PackCard
                  key={pack.id}
                  pack={pack}
                  stackIndex={index}
                  disabled={disabled}
                  onPress={() => onBuyPack(pack.id)}
                  onInfoPress={setInfoPack}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>

      <Modal
        visible={!!infoPack}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoPack(null)}
      >
        <Pressable style={styles.infoBackdrop} onPress={() => setInfoPack(null)}>
          <Pressable style={styles.infoCard} onPress={() => {}}>
            <Text style={styles.infoTitle}>{infoPack?.name || 'Пак'}</Text>
            {infoPack
              ? getPackInfoLines(infoPack)
                  .slice(1)
                  .map((line) => (
                    <Text key={line} style={styles.infoLine}>
                      {line}
                    </Text>
                  ))
              : null}
            <TouchableOpacity
              style={styles.infoClose}
              onPress={() => setInfoPack(null)}
            >
              <Text style={styles.infoCloseText}>Понятно</Text>
            </TouchableOpacity>
            {infoPack ? (
              <TouchableOpacity
                style={styles.infoBuy}
                disabled={disabled}
                onPress={() => {
                  const id = infoPack.id;
                  setInfoPack(null);
                  onBuyPack(id);
                }}
              >
                <View style={styles.infoBuyRow}>
                  <Text style={styles.infoBuyText}>
                    {infoPack.price === 0 ? 'Открыть бесплатно' : 'Купить'}
                  </Text>
                  {infoPack.price > 0 ? (
                    <>
                      <Text style={styles.infoBuyText}>{infoPack.price}</Text>
                      <CoinIcon size={18} />
                    </>
                  ) : null}
                </View>
              </TouchableOpacity>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 12,
    padding: 14,
    borderRadius: BubbleTheme.radius,
    backgroundColor: BubbleTheme.card,
    borderWidth: 1,
    borderColor: BubbleTheme.line,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 12,
    fontWeight: '600',
    color: BubbleTheme.muted,
  },
  coinPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  coinPickerLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: BubbleTheme.muted,
  },
  coinPick: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: BubbleTheme.line,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BubbleTheme.track,
  },
  coinPickActive: {
    borderColor: BubbleTheme.primary,
    backgroundColor: '#FFE4EC',
  },
  folderBlock: {
    marginTop: 4,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 6,
    gap: 4,
    zIndex: 2,
  },
  folderTab: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 2,
    borderBottomWidth: 2,
    marginBottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderTabActive: {
    borderBottomWidth: 0,
    paddingBottom: 12,
    marginBottom: -2,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '800',
  },
  tabTextActive: {
    fontSize: 13,
  },
  shelfWindow: {
    minHeight: 200,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 18,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: 'center',
    zIndex: 1,
  },
  shelfRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 24,
    paddingLeft: 4,
  },
  empty: {
    textAlign: 'center',
    color: BubbleTheme.muted,
    fontWeight: '600',
  },
  infoBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(42, 33, 80, 0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  infoCard: {
    backgroundColor: BubbleTheme.card,
    borderRadius: BubbleTheme.radius,
    padding: 20,
    borderWidth: 2,
    borderColor: BubbleTheme.line,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BubbleTheme.text,
    marginBottom: 10,
  },
  infoLine: {
    fontSize: 14,
    fontWeight: '600',
    color: BubbleTheme.muted,
    marginBottom: 6,
  },
  infoClose: {
    marginTop: 12,
    minHeight: 44,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: BubbleTheme.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCloseText: {
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  infoBuy: {
    marginTop: 10,
    minHeight: 44,
    borderRadius: 999,
    backgroundColor: BubbleTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  infoBuyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoBuyText: {
    fontWeight: '800',
    color: BubbleTheme.onPrimary,
    fontSize: 15,
  },
});

export default PackShopShelf;
