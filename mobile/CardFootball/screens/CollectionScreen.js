// Экран коллекции карт

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PackService } from '../services/PackService';
import CardItem from '../components/CardItem';
import { BubbleTheme } from '../theme/bubble';

const CollectionScreen = () => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  
  // Фильтры
  const [filters, setFilters] = useState({
    rarity: 'all',
    position: 'all',
    search: ''
  });

  // Данные о коллекции
  const [collectionStats, setCollectionStats] = useState({
    completion: null,
    statsByRarity: null,
    statsByPosition: null,
    playerCurrency: null
  });

  // Загрузка данных коллекции
  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const collectionResult = PackService.getPlayerCollection();
      if (!collectionResult || collectionResult.success === false) {
        throw new Error(collectionResult?.error || 'collection_failed');
      }

      const completionResult = PackService.getCollectionCompletion();
      const statsByRarityResult = PackService.getCollectionStatsByRarity();
      const statsByPositionResult = PackService.getCollectionStatsByPosition();
      const currencyResult = PackService.getPlayerCurrency();

      const allCardsRaw = require('../game_logic/player_cards');
      const allCards = Array.isArray(allCardsRaw) ? allCardsRaw : [];
      const collectionCardIds = collectionResult.collection?.cards || [];

      const collectionCards =
        Array.isArray(allCards) && Array.isArray(collectionCardIds)
          ? allCards.filter((card) => collectionCardIds.includes(card.id))
          : [];

      setCards(collectionCards);
      setFilteredCards(collectionCards);

      setCollectionStats({
        completion: completionResult,
        statsByRarity: statsByRarityResult,
        statsByPosition: statsByPositionResult,
        playerCurrency: currencyResult,
      });
    } catch (error) {
      setLoadError('Не удалось загрузить коллекцию');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Применение фильтров
  useEffect(() => {
    let result = cards;
    
    // Фильтр по редкости
    if (filters.rarity !== 'all') {
      result = result.filter(card => card.rarity === filters.rarity);
    }
    
    // Фильтр по позиции
    if (filters.position !== 'all') {
      result = result.filter(card => card.position === filters.position);
    }
    
    // Поиск
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(card => 
        card.name.toLowerCase().includes(searchLower) ||
        card.team.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredCards(result);
  }, [filters, cards]);

  // Обработка нажатия на карту
  const handleCardPress = (card) => {
    Alert.alert(
      card.name,
      `\nКоманда: ${card.team}\nСтрана: ${card.country}\n\nАтака: ${card.attack}\nЗащита: ${card.defense}\nСкорость: ${card.speed}\nТехника: ${card.technique}\n\nСпособности: ${card.abilities?.join(', ') || 'Нет'}\n\nКарта ${card.rarity} редкости`,
      [{ text: 'OK' }]
    );
  };

  // Рендер элемента списка
  const renderItem = ({ item }) => (
    <CardItem 
      card={item} 
      onPress={() => handleCardPress(item)} 
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>У вас пока нет карт в коллекции</Text>
      <Text style={styles.emptyHint}>Откройте пакет — карты появятся здесь</Text>
      <TouchableOpacity
        style={styles.emptyCta}
        onPress={() => navigation.navigate('Пакеты')}
        accessibilityRole="button"
      >
        <Text style={styles.emptyCtaText}>Открыть пакеты</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Моя коллекция</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={BubbleTheme.primary} />
          <Text style={styles.loadingText}>Загрузка коллекции...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Моя коллекция</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{loadError}</Text>
          <TouchableOpacity
            style={styles.emptyCta}
            onPress={loadCollection}
            accessibilityRole="button"
          >
            <Text style={styles.emptyCtaText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Моя коллекция</Text>
        
        {/* Отображение статистики коллекции */}
        {collectionStats.completion && (
          <View style={styles.statsHeader}>
            <Text style={styles.statsText}>
              {collectionStats.completion.collectedCards} из {collectionStats.completion.totalCards} карт
            </Text>
            <Text style={styles.statsText}>
              Заполнено: {collectionStats.completion.completionPercentage}%
            </Text>
            {collectionStats.playerCurrency && (
              <Text style={[styles.statsText, styles.currencyText]}>
                Монет: {collectionStats.playerCurrency.currency}
              </Text>
            )}
          </View>
        )}
      </View>
      
      {/* Фильтры */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.rarity === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, rarity: 'all'})}
          >
            <Text
              style={[
                styles.filterButtonText,
                filters.rarity === 'all' && styles.filterButtonTextActive,
              ]}
            >
              Все
            </Text>
          </TouchableOpacity>

          {[
            ['common', 'Обычные'],
            ['rare', 'Редкие'],
            ['epic', 'Эпические'],
            ['legendary', 'Легендарные'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterButton,
                filters.rarity === key && styles.filterButtonActive,
              ]}
              onPress={() => setFilters({ ...filters, rarity: key })}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filters.rarity === key && styles.filterButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterRow}>
          {[
            ['all', 'Все позиции'],
            ['attacker', 'Нападающие'],
            ['midfielder', 'Полузащитники'],
            ['defender', 'Защитники'],
            ['goalkeeper', 'Вратари'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterButton,
                filters.position === key && styles.filterButtonActive,
              ]}
              onPress={() => setFilters({ ...filters, position: key })}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filters.position === key && styles.filterButtonTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {/* Поиск */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по имени или команде..."
          value={filters.search}
          onChangeText={(text) => setFilters({...filters, search: text})}
        />
      </View>
      
      {/* Список карт */}
      <FlatList
        data={filteredCards}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BubbleTheme.bg,
  },
  header: {
    backgroundColor: BubbleTheme.bar,
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BubbleTheme.text,
    textAlign: 'center',
  },
  statsHeader: {
    marginTop: 10,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: BubbleTheme.muted,
    marginVertical: 2,
  },
  currencyText: {
    color: BubbleTheme.primary,
    fontWeight: 'bold',
  },
  filtersContainer: {
    padding: 10,
    backgroundColor: BubbleTheme.card,
    borderBottomWidth: 1,
    borderBottomColor: BubbleTheme.line,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 10,
    gap: 6,
  },
  filterButton: {
    backgroundColor: BubbleTheme.track,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: BubbleTheme.primary,
  },
  filterButtonText: {
    color: BubbleTheme.text,
    fontSize: 12,
    fontWeight: '700',
  },
  filterButtonTextActive: {
    color: BubbleTheme.onPrimary,
  },
  searchContainer: {
    padding: 10,
    backgroundColor: BubbleTheme.card,
  },
  searchInput: {
    backgroundColor: BubbleTheme.track,
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: BubbleTheme.text,
    minHeight: 44,
  },
  listContainer: {
    padding: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    minHeight: 280,
  },
  emptyText: {
    fontSize: 16,
    color: BubbleTheme.text,
    textAlign: 'center',
    fontWeight: '700',
  },
  emptyHint: {
    marginTop: 8,
    fontSize: 14,
    color: BubbleTheme.muted,
    textAlign: 'center',
  },
  emptyCta: {
    marginTop: 16,
    backgroundColor: BubbleTheme.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    minHeight: 44,
    justifyContent: 'center',
  },
  emptyCtaText: {
    color: BubbleTheme.onPrimary,
    fontWeight: '800',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BubbleTheme.bg,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: BubbleTheme.muted,
  },
});

export default CollectionScreen;