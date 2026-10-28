// Pack opening screen — Bubble («Шарик»)

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { PackService } from '../services/PackService';
import { getPackArt } from '../components/PackCard';
import PackShopShelf from '../components/PackShopShelf';
import CollectionStats from '../components/CollectionStats';
import CoinIcon from '../components/CoinIcon';
import { BubbleTheme } from '../theme/bubble';

const PackOpeningScreen = () => {
  const [packs, setPacks] = useState([]);
  const [stats, setStats] = useState({
    collection: null,
    statsByRarity: null,
    statsByPosition: null,
    completion: null,
    playerCurrency: null,
  });
  const [loading, setLoading] = useState(true);
  const [isOpening, setIsOpening] = useState(false);
  const [openingPackId, setOpeningPackId] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [packResult, setPackResult] = useState(null);
  const [scrollAreaHeight, setScrollAreaHeight] = useState(0);
  const pulseAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadPackData();
  }, []);

  useEffect(() => {
    if (!isOpening) {
      pulseAnimation.setValue(1);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isOpening, pulseAnimation]);

  const refreshStats = () => {
    const collectionResult = PackService.getPlayerCollection();
    const statsByRarityResult = PackService.getCollectionStatsByRarity();
    const statsByPositionResult = PackService.getCollectionStatsByPosition();
    const completionResult = PackService.getCollectionCompletion();
    const currencyResult = PackService.getPlayerCurrency();
    setStats({
      collection: collectionResult,
      statsByRarity: statsByRarityResult,
      statsByPosition: statsByPositionResult,
      completion: completionResult,
      playerCurrency: currencyResult,
    });
  };

  const loadPackData = () => {
    try {
      setLoading(true);
      const packTypes = PackService.getAllPackTypes();
      setPacks(packTypes);
      refreshStats();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные пакетов');
      console.error('Error loading pack data:', error);
    } finally {
      setLoading(false);
    }
  };

  const balance =
    typeof stats.playerCurrency?.currency === 'number'
      ? stats.playerCurrency.currency
      : 0;

  const handleOpenPack = (packTypeId) => {
    if (isOpening) return;

    const pack = packs.find((p) => p.id === packTypeId);
    if (!pack) return;

    const current =
      PackService.getPlayerCurrency()?.currency ?? balance;

    if (current < pack.price) {
      Alert.alert(
        'Не хватает монет',
        `Нужно ${pack.price}, у вас ${current}.`,
        [{ text: 'Понятно' }]
      );
      return;
    }

    Alert.alert(
      'Купить пак',
      pack.price === 0
        ? `Открыть «${pack.name}» бесплатно?`
        : `Купить «${pack.name}» за ${pack.price} монет и сразу открыть?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: pack.price === 0 ? 'Открыть' : 'Купить',
          onPress: async () => {
            setOpeningPackId(packTypeId);
            setIsOpening(true);
            try {
              const result = await PackService.openPack(packTypeId);
              if (result.success) {
                setPackResult(result);
                setShowResults(true);
                refreshStats();
              } else {
                Alert.alert('Ошибка', result.error || 'Не удалось открыть пакет', [
                  { text: 'Повторить', onPress: () => handleOpenPack(packTypeId) },
                  { text: 'Отмена', style: 'cancel' },
                ]);
              }
            } catch (error) {
              Alert.alert('Ошибка', 'Не удалось открыть пакет', [
                { text: 'Повторить', onPress: () => handleOpenPack(packTypeId) },
                { text: 'Отмена', style: 'cancel' },
              ]);
              console.error('Error opening pack:', error);
            } finally {
              setIsOpening(false);
              setOpeningPackId(null);
            }
          },
        },
      ]
    );
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setPackResult(null);
  };

  const renderHeader = () => (
    <View style={styles.topBar}>
      <View>
        <Text style={styles.topTitle}>Магазин</Text>
        <Text style={styles.topSubtitle}>паки · купить и открыть</Text>
      </View>
      <View style={styles.balancePill}>
        <Text style={styles.balanceText}>{balance}</Text>
        <CoinIcon size={22} style={styles.balanceCoin} />
      </View>
    </View>
  );

  if (loading && packs.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingBlock}>
          <ActivityIndicator size="large" color={BubbleTheme.primary} />
          <Text style={styles.loadingText}>Загрузка пакетов...</Text>
        </View>
      </View>
    );
  }

  if (!loading && packs.length === 0) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingBlock}>
          <Text style={styles.loadingText}>Пакеты временно недоступны</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadPackData}>
            <Text style={styles.retryText}>Обновить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        const next = Math.floor(e.nativeEvent.layout.height);
        if (next > 0 && next !== scrollAreaHeight) {
          setScrollAreaHeight(next);
        }
      }}
    >
      <ScrollView
        style={[
          styles.list,
          scrollAreaHeight > 0 ? { height: scrollAreaHeight } : null,
          Platform.OS === 'web' ? styles.listWeb : null,
        ]}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {renderHeader()}

        <CollectionStats
          stats={stats}
          completion={stats.completion}
        />

        <PackShopShelf
          packs={packs}
          disabled={isOpening}
          onBuyPack={handleOpenPack}
        />
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showResults}
        onRequestClose={handleCloseResults}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Новые карты</Text>

          {packResult && (
            <>
              <Text style={styles.resultText}>
                Открыт пакет: {packResult.packType}
              </Text>

              <Text style={styles.sectionTitle}>Получено:</Text>
              {packResult.collectionResult?.newCards?.map((card) => (
                <View key={card.id} style={styles.cardResultItem}>
                  <Text style={styles.cardName}>{card.name}</Text>
                  <Text style={styles.cardMeta}>{card.position}</Text>
                </View>
              ))}

              {packResult.collectionResult?.duplicates?.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Дубликаты:</Text>
                  {packResult.collectionResult.duplicates.map((card) => (
                    <View key={`dup-${card.id}`} style={styles.cardResultItem}>
                      <Text style={styles.cardName}>{card.name}</Text>
                      <Text style={styles.duplicateText}>
                        Дубликат · +{PackService.getCurrencyForDuplicate(card.rarity)} монет
                      </Text>
                    </View>
                  ))}
                </>
              )}

              <Text style={styles.finalBalance}>
                Баланс: {packResult.playerCurrency?.currency ?? balance} монет
              </Text>
            </>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={handleCloseResults}>
            <Text style={styles.closeButtonText}>Закрыть</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {isOpening && (
        <View style={styles.openingOverlay}>
          <Animated.View
            style={[styles.openingContainer, { transform: [{ scale: pulseAnimation }] }]}
          >
            <Text style={styles.openingText}>Вскрываем пак...</Text>
            <Image
              source={getPackArt(openingPackId)}
              style={styles.openingPackArt}
              resizeMode="cover"
            />
            <ActivityIndicator
              style={styles.openingSpinner}
              size="large"
              color={BubbleTheme.primary}
            />
          </Animated.View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: BubbleTheme.bg,
  },
  topBar: {
    backgroundColor: BubbleTheme.bar,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'web' ? 20 : 48,
    paddingBottom: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  topSubtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: BubbleTheme.muted,
  },
  balancePill: {
    minHeight: 44,
    minWidth: 72,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: BubbleTheme.coinBg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: '800',
    color: BubbleTheme.coin,
  },
  balanceCoin: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.55)',
  },
  list: {
    flexGrow: 1,
    flexShrink: 1,
  },
  listWeb: {
    overflow: 'auto',
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: BubbleTheme.muted,
    textAlign: 'center',
  },
  retryBtn: {
    marginTop: 16,
    minHeight: 44,
    paddingHorizontal: 24,
    borderRadius: 999,
    backgroundColor: BubbleTheme.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryText: {
    color: BubbleTheme.onPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: BubbleTheme.card,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    color: BubbleTheme.text,
  },
  resultText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    color: BubbleTheme.muted,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 16,
    marginBottom: 8,
    color: BubbleTheme.text,
  },
  cardResultItem: {
    backgroundColor: BubbleTheme.bg,
    padding: 14,
    marginVertical: 6,
    borderRadius: BubbleTheme.radius,
    borderWidth: 1,
    borderColor: BubbleTheme.line,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: BubbleTheme.text,
  },
  cardMeta: {
    fontSize: 13,
    color: BubbleTheme.muted,
    marginTop: 4,
  },
  duplicateText: {
    fontSize: 13,
    color: BubbleTheme.primary,
    marginTop: 4,
    fontWeight: '700',
  },
  finalBalance: {
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 20,
    color: BubbleTheme.text,
  },
  closeButton: {
    backgroundColor: BubbleTheme.primary,
    padding: 15,
    borderRadius: 999,
    marginTop: 20,
    alignItems: 'center',
    minHeight: 44,
  },
  closeButtonText: {
    color: BubbleTheme.onPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  openingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(42, 33, 80, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  openingContainer: {
    backgroundColor: BubbleTheme.card,
    padding: 28,
    borderRadius: 24,
    alignItems: 'center',
  },
  openingText: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
    color: BubbleTheme.text,
  },
  openingPackArt: {
    width: 140,
    height: 186,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: BubbleTheme.primary,
  },
  openingSpinner: {
    marginTop: 16,
  },
});

export default PackOpeningScreen;
