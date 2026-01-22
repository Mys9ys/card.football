// Компонент для отображения карточки пакета

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PackCard = ({ pack, onPress }) => {
  // Определение цвета рамки в зависимости от редкости пакета
  const getBorderColor = () => {
    switch (pack.id) {
      case 'legendary':
      case 'golden_legends':
        return '#FFD700'; // Золотой для легендарных пакетов
      case 'premium':
      case 'defense_pack':
        return '#8A2BE2'; // Фиолетовый для премиум пакетов
      case 'standard':
        return '#1E90FF'; // Синий для стандартных пакетов
      case 'starter':
        return '#32CD32'; // Зеленый для стартовых пакетов
      default:
        return '#CCCCCC'; // Серый для других
    }
  };

  // Определение названия редкости
  const getRarityName = () => {
    switch (pack.id) {
      case 'legendary':
      case 'golden_legends':
        return 'Легендарный';
      case 'premium':
      case 'defense_pack':
        return 'Премиум';
      case 'standard':
        return 'Стандартный';
      case 'starter':
        return 'Стартовый';
      default:
        return 'Обычный';
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { borderColor: getBorderColor() }]} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.rarity}>{getRarityName()}</Text>
        <Text style={styles.price}>{pack.price} монет</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{pack.name}</Text>
        <Text style={styles.description}>{pack.description}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Карт</Text>
            <Text style={styles.statValue}>{pack.cardsCount}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Шанс легендарной</Text>
            <Text style={styles.statValue}>
              {pack.rarityWeights.legendary || 0}%
            </Text>
          </View>
        </View>
        
        {pack.guaranteedLegendary && (
          <View style={styles.guaranteeContainer}>
            <Text style={styles.guaranteeText}>✓ Гарантированная легендарная карта</Text>
          </View>
        )}
        
        {pack.guaranteedEpic && !pack.guaranteedLegendary && (
          <View style={styles.guaranteeContainer}>
            <Text style={styles.guaranteeText}>✓ Гарантированная эпическая карта</Text>
          </View>
        )}
        
        {pack.guaranteedRare && !pack.guaranteedEpic && (
          <View style={styles.guaranteeContainer}>
            <Text style={styles.guaranteeText}>✓ Гарантированная редкая карта</Text>
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.buyText}>КУПИТЬ</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 3,
    borderRadius: 15,
    margin: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rarity: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  content: {
    padding: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  guaranteeContainer: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#add8e6',
  },
  guaranteeText: {
    fontSize: 12,
    color: '#006400',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#0066cc',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
});

export default PackCard;