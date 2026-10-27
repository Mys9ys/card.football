// Экран коллекции карт

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { PackService } from '../services/PackService';
import CardItem from '../components/CardItem';

const CollectionScreen = () => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      
      // Получение данных из сервиса
      const collectionResult = PackService.getPlayerCollection();
      const completionResult = PackService.getCollectionCompletion();
      const statsByRarityResult = PackService.getCollectionStatsByRarity();
      const statsByPositionResult = PackService.getCollectionStatsByPosition();
      const currencyResult = PackService.getPlayerCurrency();
      
      // Получение всех карт из коллекции
      const allCardsRaw = require('../game_logic/player_cards');
      const allCards = Array.isArray(allCardsRaw) ? allCardsRaw : [];
      const collectionCardIds = collectionResult.collection?.cards || [];
      
      console.log('All available cards:', allCards);
      console.log('Collection card IDs:', collectionCardIds);
      
      // Выводим информацию о тестовых картах
      const testCards = allCards.filter(card => card.id.startsWith('test_'));
      console.log('Test cards in allCards:', testCards);
      
      // Фильтрация карт в коллекции
      const collectionCards = Array.isArray(allCards) && Array.isArray(collectionCardIds) 
        ? allCards.filter(card => collectionCardIds.includes(card.id))
        : [];
      
      console.log('Collection result:', collectionResult);
      console.log('Filtered cards count:', collectionCards.length);
      console.log('Filtered cards:', collectionCards);
      
      setCards(collectionCards);
      setFilteredCards(collectionCards);
      
      // Установка статистики
      setCollectionStats({
        completion: completionResult,
        statsByRarity: statsByRarityResult,
        statsByPosition: statsByPositionResult,
        playerCurrency: currencyResult
      });
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить коллекцию');
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

  // Рендер пустого состояния
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>У вас пока нет карт в коллекции</Text>
    </View>
  );

  // Рендер загрузки
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Моя коллекция</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Загрузка коллекции...</Text>
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
            <Text style={styles.filterButtonText}>Все</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.rarity === 'common' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, rarity: 'common'})}
          >
            <Text style={styles.filterButtonText}>Обычные</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.rarity === 'rare' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, rarity: 'rare'})}
          >
            <Text style={styles.filterButtonText}>Редкие</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.rarity === 'epic' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, rarity: 'epic'})}
          >
            <Text style={styles.filterButtonText}>Эпические</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.rarity === 'legendary' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, rarity: 'legendary'})}
          >
            <Text style={styles.filterButtonText}>Легендарные</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.filterRow}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.position === 'all' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, position: 'all'})}
          >
            <Text style={styles.filterButtonText}>Все позиции</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.position === 'attacker' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, position: 'attacker'})}
          >
            <Text style={styles.filterButtonText}>Нападающие</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.position === 'midfielder' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, position: 'midfielder'})}
          >
            <Text style={styles.filterButtonText}>Полузащитники</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.position === 'defender' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, position: 'defender'})}
          >
            <Text style={styles.filterButtonText}>Защитники</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              filters.position === 'goalkeeper' && styles.filterButtonActive
            ]}
            onPress={() => setFilters({...filters, position: 'goalkeeper'})}
          >
            <Text style={styles.filterButtonText}>Вратари</Text>
          </TouchableOpacity>
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

import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFF6FF',
  },
  header: {
    backgroundColor: '#9BE7FF',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A2150',
    textAlign: 'center',
  },
  statsHeader: {
    marginTop: 10,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: '#6A6290',
    marginVertical: 2,
  },
  currencyText: {
    color: '#FF6B8A',
    fontWeight: 'bold',
  },
  filtersContainer: {
    padding: 10,
    backgroundColor: '#FFF7FB',
    borderBottomWidth: 1,
    borderBottomColor: '#B9E8F7',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterButton: {
    backgroundColor: '#E5F7FF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    marginHorizontal: 5,
    minHeight: 36,
  },
  filterButtonActive: {
    backgroundColor: '#FF6B8A',
  },
  filterButtonText: {
    color: '#2A2150',
    fontSize: 12,
    fontWeight: '700',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#FFF7FB',
  },
  searchInput: {
    backgroundColor: '#E5F7FF',
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2A2150',
  },
  listContainer: {
    padding: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6A6290',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DFF6FF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6A6290',
  },
});

export default CollectionScreen;