// Экран турниров

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import TournamentCard from '../components/TournamentCard';

const TournamentScreen = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('available');
  const [registeredTournaments, setRegisteredTournaments] = useState([]);

  // Моковые данные турниров
  const mockTournaments = [
    {
      id: 't1',
      name: 'Кубок Легенд',
      type: 'cup',
      difficulty: 'hard',
      teamsCount: 16,
      rounds: 4,
      prizeFund: 15000,
      description: 'Престижный кубок для сильнейших команд. Победитель получает легендарную карту!',
      image: 'https://via.placeholder.com/300x120/FFD700/000000?text=Кубок+Легенд'
    },
    {
      id: 't2',
      name: 'Лига Чемпионов',
      type: 'league',
      difficulty: 'expert',
      teamsCount: 32,
      rounds: 7,
      prizeFund: 25000,
      description: 'Самый престижный турнир в мире. Только для настоящих чемпионов.',
      image: 'https://via.placeholder.com/300x120/0000FF/FFFFFF?text=Лига+Чемпионов'
    },
    {
      id: 't3',
      name: 'Кубок Новичков',
      type: 'cup',
      difficulty: 'easy',
      teamsCount: 8,
      rounds: 3,
      prizeFund: 5000,
      description: 'Идеальный турнир для новичков. Хороший шанс получить первую победу.',
      image: 'https://via.placeholder.com/300x120/00FF00/000000?text=Кубок+Новичков'
    },
    {
      id: 't4',
      name: 'Международный Чемпионат',
      type: 'championship',
      difficulty: 'medium',
      teamsCount: 24,
      rounds: 5,
      prizeFund: 12000,
      description: 'Турнир между национальными сборными. Покажи, что ты лучший!',
      image: 'https://via.placeholder.com/300x120/FF69B4/000000?text=Чемпионат'
    },
    {
      id: 't5',
      name: 'Лига Мастеров',
      type: 'league',
      difficulty: 'medium',
      teamsCount: 12,
      rounds: 11,
      prizeFund: 8000,
      description: 'Регулярная лига с постепенным повышением сложности.',
      image: 'https://via.placeholder.com/300x120/FFA500/000000?text=Лига+Мастеров'
    }
  ];

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      setLoading(true);
      // Имитация загрузки данных
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTournaments(mockTournaments);
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить турниры');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Обработка регистрации на турнир
  const handleRegister = (tournament) => {
    Alert.alert(
      'Запись на турнир',
      `Вы уверены, что хотите записаться на турнир "${tournament.name}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Записаться',
          onPress: () => {
            setRegisteredTournaments(prev => [...prev, tournament.id]);
            Alert.alert('Успешно', `Вы успешно записаны на турнир "${tournament.name}"!`);
          }
        }
      ]
    );
  };

  // Фильтрация турниров
  const filteredTournaments = tournaments.filter(tournament => {
    if (selectedTab === 'available') {
      return !registeredTournaments.includes(tournament.id);
    } else {
      return registeredTournaments.includes(tournament.id);
    }
  });

  // Рендер элемента списка
  const renderItem = ({ item }) => (
    <TournamentCard 
      tournament={item} 
      onPress={handleRegister} 
    />
  );

  // Рендер пустого состояния
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {selectedTab === 'available' 
          ? 'Нет доступных турниров' 
          : 'Вы не зарегистрированы ни на один турнир'}
      </Text>
    </View>
  );

  // Рендер загрузки
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Турниры</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Загрузка турниров...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Турниры</Text>
        
        {/* Статистика */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Доступно: {tournaments.length} турниров</Text>
          <Text style={styles.statsText}>Записано: {registeredTournaments.length}</Text>
        </View>
      </View>
      
      {/* Вкладки */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            selectedTab === 'available' && styles.tabButtonActive
          ]}
          onPress={() => setSelectedTab('available')}
        >
          <Text style={styles.tabButtonText}>Доступные</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            selectedTab === 'registered' && styles.tabButtonActive
          ]}
          onPress={() => setSelectedTab('registered')}
        >
          <Text style={styles.tabButtonText}>Мои турниры</Text>
        </TouchableOpacity>
      </View>
      
      {/* Список турниров */}
      <FlatList
        data={filteredTournaments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
      
      {/* Кнопка обновления */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={loadTournaments}
      >
        <Text style={styles.refreshButtonText}>Обновить</Text>
      </TouchableOpacity>
    </View>
  );
};

import { ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#0066cc',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  statsContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tabButtonActive: {
    backgroundColor: '#0066cc',
  },
  tabButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: '#0066cc',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TournamentScreen;