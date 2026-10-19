// Экран профиля игрока: коллекция и счётчики из PackService.

import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { PackService } from '../services/PackService';

const RARITY_LABELS = {
  common: 'Обычные',
  rare: 'Редкие',
  epic: 'Эпические',
  legendary: 'Легендарные',
};

const RARITY_COLORS = {
  common: '#CCCCCC',
  rare: '#1E90FF',
  epic: '#8A2BE2',
  legendary: '#FFD700',
};

const POSITION_LABELS = {
  attacker: 'Нападающие',
  midfielder: 'Полузащитники',
  defender: 'Защитники',
  goalkeeper: 'Вратари',
};

const CARD_POSITION_LABELS = {
  attacker: 'Нападающий',
  midfielder: 'Полузащитник',
  defender: 'Защитник',
  goalkeeper: 'Вратарь',
};

function unwrap(result, fallbackMessage) {
  if (!result || result.success === false) {
    throw new Error(result?.error || fallbackMessage);
  }
  return result;
}

function formatTimestamp(iso) {
  if (!iso) {
    return '';
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleString('ru-RU');
}

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return 0;
  }
  return Math.min(100, Math.max(0, number));
}

function buildActivity(collection) {
  if (!collection) {
    return [];
  }

  const timestamp = collection.lastUpdated;
  const items = [];

  if (collection.cardsObtained > 0) {
    items.push({
      id: 'cards-obtained',
      type: 'pack',
      title: 'Карты из пакетов',
      description: `Получено карт: ${collection.cardsObtained}. Уникальных в коллекции: ${collection.cards?.length || 0}`,
      timestamp,
    });
  }

  if (collection.duplicateCards > 0) {
    items.push({
      id: 'duplicates',
      type: 'collection',
      title: 'Дубликаты',
      description: `Дубликатов обменяно на монеты: ${collection.duplicateCards}`,
      timestamp,
    });
  }

  if (collection.cardUpgrades > 0) {
    items.push({
      id: 'upgrades',
      type: 'achievement',
      title: 'Улучшения',
      description: `Улучшений карт: ${collection.cardUpgrades}`,
      timestamp,
    });
  }

  return items;
}

function loadProfile() {
  const collectionResult = unwrap(
    PackService.getPlayerCollection(),
    'Не удалось загрузить коллекцию'
  );
  const completion = unwrap(
    PackService.getCollectionCompletion(),
    'Не удалось посчитать заполнение коллекции'
  );
  const rarity = unwrap(
    PackService.getCollectionStatsByRarity(),
    'Не удалось посчитать карты по редкости'
  );
  const position = unwrap(
    PackService.getCollectionStatsByPosition(),
    'Не удалось посчитать карты по позициям'
  );
  const currency = unwrap(
    PackService.getPlayerCurrency(),
    'Не удалось загрузить монеты'
  );
  const recommendations = unwrap(
    PackService.getCollectionRecommendations(),
    'Не удалось загрузить рекомендации'
  );

  const collection = collectionResult.collection;

  return {
    currency: currency.currency ?? 0,
    collection,
    completion,
    rarity: rarity.stats || {},
    position: position.stats || {},
    recommendations: Array.isArray(recommendations.recommendations)
      ? recommendations.recommendations
      : [],
    missingTotal: recommendations.missingTotal ?? 0,
    activity: buildActivity(collection),
  };
}

const ProfileScreen = ({ navigation }) => {
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [selectedTab, setSelectedTab] = useState('stats');
  const hasLoaded = useRef(false);

  const loadProfileData = useCallback(async ({ silent } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setStatus('loading');
    }

    try {
      const nextProfile = loadProfile();
      setProfile(nextProfile);
      setErrorMessage('');
      setStatus('ready');
      hasLoaded.current = true;
    } catch (error) {
      setErrorMessage(error?.message || 'Не удалось загрузить профиль');
      setStatus('error');
    } finally {
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfileData({ silent: hasLoaded.current });
    }, [loadProfileData])
  );

  const handleRecommendationPress = (card) => {
    const power = (card.attack || 0) + (card.defense || 0) + (card.speed || 0) + (card.technique || 0);
    Alert.alert(
      card.name,
      `Позиция: ${CARD_POSITION_LABELS[card.position] || 'Позиция'}\nРедкость: ${RARITY_LABELS[card.rarity] || card.rarity}\nСила: ${power}\n\nЭтой карты ещё нет в коллекции.`,
      [{ text: 'OK' }]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text style={styles.title}>Профиль</Text>
        <Text style={styles.subtitle}>Локальный профиль</Text>
      </View>
      {status === 'ready' && profile && (
        <View style={styles.currencyContainer}>
          <Text style={styles.currencyText}>{profile.currency}</Text>
          <Text style={styles.currencyLabel}>Монет</Text>
        </View>
      )}
    </View>
  );

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.centeredText}>Загрузка профиля...</Text>
        </View>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.centered}>
          <Ionicons name="alert-circle-outline" size={40} color="#c62828" />
          <Text style={styles.errorTitle}>Не удалось загрузить профиль</Text>
          <Text style={styles.centeredText}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => loadProfileData()}
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const collected = profile.completion.collectedCards || 0;
  const total = profile.completion.totalCards || 0;
  const percent = clampPercent(profile.completion.completionPercentage);
  const collectionEmpty = collected === 0;

  return (
    <View style={styles.container}>
      {renderHeader()}

      <View style={styles.tabsContainer}>
        <TabButton
          label="Статистика"
          active={selectedTab === 'stats'}
          onPress={() => setSelectedTab('stats')}
        />
        <TabButton
          label="Коллекция"
          active={selectedTab === 'collection'}
          onPress={() => setSelectedTab('collection')}
        />
        <TabButton
          label="Активность"
          active={selectedTab === 'activity'}
          onPress={() => setSelectedTab('activity')}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadProfileData({ silent: true })}
            colors={['#0066cc']}
            tintColor="#0066cc"
          />
        }
      >
        {selectedTab === 'stats' && (
          <StatsTab profile={profile} collected={collected} total={total} percent={percent} />
        )}
        {selectedTab === 'collection' && (
          <CollectionTab
            profile={profile}
            collected={collected}
            total={total}
            percent={percent}
            collectionEmpty={collectionEmpty}
            onOpenPacks={() => navigation.navigate('Пакеты')}
            onRecommendationPress={handleRecommendationPress}
          />
        )}
        {selectedTab === 'activity' && <ActivityTab activity={profile.activity} />}
      </ScrollView>
    </View>
  );
};

const TabButton = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.tabButton, active && styles.tabButtonActive]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityState={{ selected: active }}
  >
    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const StatsTab = ({ profile, collected, total, percent }) => {
  const collection = profile.collection || {};
  const tiles = [
    { label: 'Монет', value: profile.currency },
    { label: 'В коллекции', value: `${collected}/${total}` },
    { label: 'Получено карт', value: collection.cardsObtained || 0 },
    { label: 'Дубликатов', value: collection.duplicateCards || 0 },
    { label: 'Улучшений', value: collection.cardUpgrades || 0 },
  ];

  return (
    <View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Аккаунт</Text>
        <View style={styles.tileRow}>
          {tiles.map((tile) => (
            <View key={tile.label} style={styles.tile}>
              <Text style={styles.tileValue}>{tile.value}</Text>
              <Text style={styles.tileLabel}>{tile.label}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.progressCaption}>Коллекция заполнена на {percent}%</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Матчи</Text>
        <View style={styles.emptyBlock}>
          <Ionicons name="football-outline" size={28} color="#0066cc" />
          <Text style={styles.emptyTitle}>Матчей ещё не было</Text>
          <Text style={styles.emptyText}>
            Победы, ничьи и голы появятся здесь, когда история матчей будет сохраняться между экранами.
          </Text>
        </View>
      </View>
    </View>
  );
};

const CollectionTab = ({
  profile,
  collected,
  total,
  percent,
  collectionEmpty,
  onOpenPacks,
  onRecommendationPress,
}) => (
  <View>
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Заполнение</Text>
      <Text style={styles.progressCaption}>{collected} из {total} карт · {percent}%</Text>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
      {collectionEmpty && (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>В коллекции пока нет карт</Text>
          <Text style={styles.emptyText}>Откройте пакет — новые карты появятся в профиле.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={onOpenPacks} accessibilityRole="button">
            <Text style={styles.primaryButtonText}>Открыть пакеты</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>

    {!collectionEmpty && (
      <>
        <CountGrid title="По редкости" counts={profile.rarity} labels={RARITY_LABELS} colors={RARITY_COLORS} />
        <CountGrid title="По позициям" counts={profile.position} labels={POSITION_LABELS} />
      </>
    )}

    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Кого искать</Text>
      <Text style={styles.progressCaption}>Не хватает карт: {profile.missingTotal}</Text>
      {profile.recommendations.length === 0 ? (
        <View style={styles.emptyBlock}>
          <Text style={styles.emptyTitle}>Рекомендаций нет</Text>
          <Text style={styles.emptyText}>Каталог собран — недостающих карт не осталось.</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recommendRow}>
          {profile.recommendations.map((card) => (
            <RecommendationCard key={card.id} card={card} onPress={() => onRecommendationPress(card)} />
          ))}
        </ScrollView>
      )}
    </View>
  </View>
);

const CountGrid = ({ title, counts, labels, colors }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.tileRow}>
      {Object.entries(labels).map(([key, label]) => (
        <View key={key} style={styles.tile}>
          {colors?.[key] && <View style={[styles.colorDot, { backgroundColor: colors[key] }]} />}
          <Text style={styles.tileValue}>{counts?.[key] || 0}</Text>
          <Text style={styles.tileLabel}>{label}</Text>
        </View>
      ))}
    </View>
  </View>
);

const RecommendationCard = ({ card, onPress }) => {
  const borderColor = RARITY_COLORS[card.rarity] || RARITY_COLORS.common;
  const power = (card.attack || 0) + (card.defense || 0) + (card.speed || 0) + (card.technique || 0);

  return (
    <TouchableOpacity
      style={[styles.recommendCard, { borderColor }]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={styles.recommendName} numberOfLines={2}>{card.name}</Text>
      <Text style={styles.recommendMeta}>{CARD_POSITION_LABELS[card.position] || 'Позиция'}</Text>
      <Text style={[styles.recommendRarity, { color: borderColor === '#CCCCCC' ? '#666' : borderColor }]}>
        {RARITY_LABELS[card.rarity] || card.rarity}
      </Text>
      <Text style={styles.recommendPower}>Сила {power}</Text>
    </TouchableOpacity>
  );
};

const ActivityTab = ({ activity }) => {
  if (!activity.length) {
    return (
      <View style={styles.card}>
        <View style={styles.emptyBlock}>
          <Ionicons name="time-outline" size={28} color="#0066cc" />
          <Text style={styles.emptyTitle}>Пока нет событий</Text>
          <Text style={styles.emptyText}>
            Откройте пакет — здесь появится запись о полученных картах и дубликатах.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      {activity.map((item) => (
        <View key={item.id} style={styles.activityItem}>
          <View style={styles.activityIcon}>
            <Ionicons
              name={item.type === 'pack' ? 'gift-outline' : item.type === 'achievement' ? 'trophy-outline' : 'albums-outline'}
              size={20}
              color="#0066cc"
            />
          </View>
          <View style={styles.activityBody}>
            <Text style={styles.activityTitle}>{item.title}</Text>
            <Text style={styles.activityDescription}>{item.description}</Text>
            {!!item.timestamp && <Text style={styles.activityTime}>{formatTimestamp(item.timestamp)}</Text>}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  currencyContainer: {
    minWidth: 72,
    minHeight: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    justifyContent: 'center',
  },
  currencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  currencyLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centeredText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabButtonActive: {
    backgroundColor: '#0066cc',
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 28,
    flexGrow: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tileRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tile: {
    width: '48%',
    minHeight: 64,
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tileLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 6,
  },
  progressCaption: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#eceff3',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0066cc',
    borderRadius: 6,
  },
  emptyBlock: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  emptyTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    textAlign: 'center',
  },
  primaryButton: {
    marginTop: 16,
    minHeight: 44,
    paddingHorizontal: 20,
    borderRadius: 22,
    backgroundColor: '#0066cc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recommendRow: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  recommendCard: {
    width: 148,
    minHeight: 120,
    marginRight: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  recommendName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  recommendMeta: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  recommendRarity: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendPower: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 44,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f1fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityBody: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  activityDescription: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  activityTime: {
    marginTop: 4,
    fontSize: 12,
    color: '#888',
  },
});

export default ProfileScreen;
