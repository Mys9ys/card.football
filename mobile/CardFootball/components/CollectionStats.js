// Компонент для отображения статистики коллекции

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CollectionStats = ({ stats, completion }) => {
  // Определение цветов для разных уровней редкости
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary':
        return '#FFD700'; // Золотой
      case 'epic':
        return '#8A2BE2'; // Фиолетовый
      case 'rare':
        return '#1E90FF'; // Синий
      case 'common':
      default:
        return '#888888'; // Серый
    }
  };

  // Определение цвета для прогресс-бара
  const getProgressColor = (percentage) => {
    if (percentage >= 75) return '#4CAF50'; // Зеленый
    if (percentage >= 50) return '#8BC34A'; // Светло-зеленый
    if (percentage >= 25) return '#FFC107'; // Оранжевый
    return '#F44336'; // Красный
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Статистика коллекции</Text>
      
      {/* Прогресс заполнения коллекции */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Заполнено: {completion?.completionPercentage || 0}%
        </Text>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBar, 
              { 
                width: `${completion?.completionPercentage || 0}%`,
                backgroundColor: getProgressColor(completion?.completionPercentage || 0)
              }
            ]} 
          />
        </View>
        <Text style={styles.totalCardsText}>
          {completion?.collectedCards || 0} из {completion?.totalCards || 0} карт
        </Text>
      </View>
      
      {/* Статистика по редкости */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Карты по редкости</Text>
        <View style={styles.statsRow}>
          {Object.entries(stats?.stats || {}).map(([rarity, count]) => (
            <View key={rarity} style={styles.statItem}>
              <View style={[styles.colorIndicator, { backgroundColor: getRarityColor(rarity) }]} />
              <Text style={styles.statLabel}>
                {rarity === 'legendary' ? 'Легендарные' : 
                 rarity === 'epic' ? 'Эпические' : 
                 rarity === 'rare' ? 'Редкие' : 'Обычные'}
              </Text>
              <Text style={styles.statValue}>{count}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Баланс игрока */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>
          Баланс: {stats?.playerCurrency?.currency || 0} монет
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  progressBarBackground: {
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  totalCardsText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  statsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    marginBottom: 10,
    width: '45%',
  },
  colorIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  balanceContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
});

export default CollectionStats;