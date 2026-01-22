// Компонент для отображения карточки турнира

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const TournamentCard = ({ tournament, onPress }) => {
  // Определение цвета фона в зависимости от типа турнира
  const getBackgroundColor = () => {
    switch (tournament.type) {
      case 'league':
        return '#e8f5e8'; // Зеленый для лиг
      case 'cup':
        return '#fff3e0'; // Оранжевый для кубков
      case 'championship':
        return '#ffebee'; // Красный для чемпионатов
      default:
        return '#f5f5f5'; // Серый
    }
  };

  // Определение цвета рамки в зависимости от призового фонда
  const getBorderColor = () => {
    if (tournament.prizeFund > 10000) return '#FFD700'; // Золотой для крупных призов
    if (tournament.prizeFund > 5000) return '#C0C0C0'; // Серебряный для средних призов
    return '#CD7F32'; // Бронзовый для малых призов
  };

  // Определение уровня сложности
  const getDifficultyText = () => {
    switch (tournament.difficulty) {
      case 'easy':
        return 'Легко';
      case 'medium':
        return 'Средне';
      case 'hard':
        return 'Сложно';
      case 'expert':
        return 'Эксперт';
      default:
        return 'Неизвестно';
    }
  };

  // Определение цвета текста уровня сложности
  const getDifficultyColor = () => {
    switch (tournament.difficulty) {
      case 'easy':
        return '#4CAF50'; // Зеленый
      case 'medium':
        return '#FF9800'; // Оранжевый
      case 'hard':
        return '#F44336'; // Красный
      case 'expert':
        return '#9C27B0'; // Фиолетовый
      default:
        return '#666';
    }
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() }]} onPress={() => onPress(tournament)}>
      <View style={styles.header}>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={[styles.difficulty, { color: getDifficultyColor() }]}>{getDifficultyText()}</Text>
      </View>
      
      {tournament.image && (
        <Image 
          source={{uri: tournament.image}} 
          style={styles.image} 
          defaultSource={require('../assets/images/default_tournament.png')}
        />
      )}
      
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Тип:</Text>
          <Text style={styles.value}>{tournament.type === 'league' ? 'Лига' : tournament.type === 'cup' ? 'Кубок' : 'Чемпионат'}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Команд:</Text>
          <Text style={styles.value}>{tournament.teamsCount}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Приз:</Text>
          <Text style={styles.value}>{tournament.prizeFund} монет</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Раундов:</Text>
          <Text style={styles.value}>{tournament.rounds}</Text>
        </View>
      </View>
      
      {tournament.description && (
        <Text style={styles.description}>{tournament.description}</Text>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.status}>Доступно</Text>
        <Text style={styles.register}>Записаться</Text>
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
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  difficulty: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    width: 80,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  description: {
    fontSize: 14,
    color: '#666',
    padding: 15,
    paddingTop: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  status: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  register: {
    fontSize: 14,
    color: '#0066cc',
    fontWeight: 'bold',
  },
});

export default TournamentCard;