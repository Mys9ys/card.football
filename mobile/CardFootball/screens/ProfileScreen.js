// Экран профиля игрока

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { PackService } from '../services/PackService';
import PlayerProfile from '../components/PlayerProfile';

const ProfileScreen = () => {
  const [playerStats, setPlayerStats] = useState(null);
  const [collectionStats, setCollectionStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('stats');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Получение данных из сервиса
      const collectionResult = PackService.getPlayerCollection();
      const completionResult = PackService.getCollectionCompletion();
      const statsByRarityResult = PackService.getCollectionStatsByRarity();
      const statsByPositionResult = PackService.getCollectionStatsByPosition();
      const currencyResult = PackService.getPlayerCurrency();
      const recommendationsResult = PackService.getCollectionRecommendations();
      
      // Генерация статистики игрока
      const stats = {
        level: 15,
        experience: 2340,
        nextLevel: 3000,
        achievements: 12,
        tournamentsPlayed: 8,
        matchesWon: 23,
        matchesLost: 12,
        matchesDraw: 5,
        totalGoals: 45,
        totalAssists: 32,
        winRate: 64.3,
        rating: 8.7
      };
      
      setPlayerStats(stats);
      setCollectionStats({
        completion: completionResult,
        statsByRarity: statsByRarityResult,
        statsByPosition: statsByPositionResult,
        playerCurrency: currencyResult,
        recommendations: recommendationsResult
      });
      
      // Генерация последней активности
      const activity = [
        { id: '1', type: 'match', title: 'Победа в матче', description: 'Победа над Командой B со счетом 3:1', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: '2', type: 'pack', title: 'Открытие пакета', description: 'Открыт пакет "Золотые легенды"', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: '3', type: 'achievement', title: 'Новое достижение', description: 'Получено достижение "Начинающий коллекционер"', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: '4', type: 'tournament', title: 'Регистрация на турнир', description: 'Запись на турнир "Кубок Новичков"', timestamp: new Date(Date.now() - 172800000).toISOString() },
        { id: '5', type: 'match', title: 'Поражение в матче', description: 'Поражение от Команды C со счетом 1:2', timestamp: new Date(Date.now() - 259200000).toISOString() }
      ];
      
      setRecentActivity(activity);
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить профиль');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Обработка нажатия на элемент активности
  const handleActivityPress = (activity) => {
    Alert.alert(activity.title, activity.description, [{ text: 'OK' }]);
  };

  // Рендер статистики
  const renderStats = () => (
    <View style={styles.statsContainer}>
      {/* Основная статистика */}
      <View style={styles.mainStatsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Уровень</Text>
          <Text style={styles.statValue}>{playerStats.level}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Опыт</Text>
          <Text style={styles.statValue}>{playerStats.experience}/{playerStats.nextLevel}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Рейтинг</Text>
          <Text style={styles.statValue}>{playerStats.rating}</Text>
        </View>
      </View>
      
      {/* Прогресс опыта */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(playerStats.experience / playerStats.nextLevel) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>До следующего уровня: {playerStats.nextLevel - playerStats.experience} опыта</Text>
      </View>
      
      {/* Дополнительная статистика */}
      <View style={styles.additionalStatsContainer}>
        <View style={styles.row}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Побед</Text>
            <Text style={styles.statValue}>{playerStats.matchesWon}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Поражений</Text>
            <Text style={styles.statValue}>{playerStats.matchesLost}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ничьих</Text>
            <Text style={styles.statValue}>{playerStats.matchesDraw}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Голов</Text>
            <Text style={styles.statValue}>{playerStats.totalGoals}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Пасов</Text>
            <Text style={styles.statValue}>{playerStats.totalAssists}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Турниров</Text>
            <Text style={styles.statValue}>{playerStats.tournamentsPlayed}</Text>
          </View>
        </View>
        
        <View style={styles.row}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Побед %</Text>
            <Text style={styles.statValue}>{playerStats.winRate}%</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Достижений</Text>
            <Text style={styles.statValue}>{playerStats.achievements}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  // Рендер коллекции
  const renderCollection = () => (
    <View style={styles.collectionContainer}>
      {/* Статистика коллекции */}
      {collectionStats && (
        <View style={styles.collectionStatsContainer}>
          <View style={styles.row}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Карт в коллекции</Text>
              <Text style={styles.statValue}>{collectionStats.completion.collectedCards}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Всего карт</Text>
              <Text style={styles.statValue}>{collectionStats.completion.totalCards}</Text>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressLabel}>Заполнение коллекции</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${collectionStats.completion.completionPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{collectionStats.completion.completionPercentage}%</Text>
          </View>
          
          {/* Статистика по редкости */}
          <View style={styles.statsByRarityContainer}>
            <Text style={styles.sectionTitle}>По редкости:</Text>
            <View style={styles.row}>
              {Object.entries(collectionStats.statsByRarity.stats).map(([rarity, count]) => (
                <View key={rarity} style={styles.rarityItem}>
                  <Text style={styles.rarityLabel}>
                    {rarity === 'common' ? 'Обычные' :
                     rarity === 'rare' ? 'Редкие' :
                     rarity === 'epic' ? 'Эпические' : 'Легендарные'}
                  </Text>
                  <Text style={styles.rarityCount}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Статистика по позициям */}
          <View style={styles.statsByPositionContainer}>
            <Text style={styles.sectionTitle}>По позициям:</Text>
            <View style={styles.row}>
              {Object.entries(collectionStats.statsByPosition.stats).map(([position, count]) => (
                <View key={position} style={styles.positionItem}>
                  <Text style={styles.positionLabel}>
                    {position === 'attacker' ? 'Нападающие' :
                     position === 'midfielder' ? 'Полузащитники' :
                     position === 'defender' ? 'Защитники' : 'Вратари'}
                  </Text>
                  <Text style={styles.positionCount}>{count}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
      
      {/* Рекомендации */}
      {collectionStats && collectionStats.recommendations && (
        <View style={styles.recommendationsContainer}>
          <Text style={styles.sectionTitle}>Рекомендации по дополнению коллекции:</Text>
          <FlatList
            data={collectionStats.recommendations.recommendations}
            renderItem={({ item }) => <PlayerProfile player={item} onPress={() => {}} />}
            keyExtractor={item => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendationsList}
          />
        </View>
      )}
    </View>
  );

  // Рендер активности
  const renderActivity = () => (
    <View style={styles.activityContainer}>
      <FlatList
        data={recentActivity}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.activityItem} onPress={() => handleActivityPress(item)}>
            <View style={styles.activityIconContainer}>
              <View style={[
                styles.activityIcon, 
                item.type === 'match' && styles.matchIcon,
                item.type === 'pack' && styles.packIcon,
                item.type === 'achievement' && styles.achievementIcon,
                item.type === 'tournament' && styles.tournamentIcon
              ]}>
                <Text style={styles.activityIconText}>
                  {item.type === 'match' ? 'M' :
                   item.type === 'pack' ? 'P' :
                   item.type === 'achievement' ? 'A' : 'T'}
                </Text>
              </View>
            </View>
            
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{item.title}</Text>
              <Text style={styles.activityDescription}>{item.description}</Text>
              <Text style={styles.activityTime}>{new Date(item.timestamp).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.activityList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // Рендер загрузки
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Профиль</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Загрузка профиля...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
        
        {/* Баланс */}
        {collectionStats && collectionStats.playerCurrency && (
          <View style={styles.currencyContainer}>
            <Text style={styles.currencyText}>{collectionStats.playerCurrency.currency}</Text>
            <Text style={styles.currencyLabel}>Монет</Text>
          </View>
        )}
      </View>
      
      {/* Вкладки */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            selectedTab === 'stats' && styles.tabButtonActive
          ]}
          onPress={() => setSelectedTab('stats')}
        >
          <Text style={styles.tabButtonText}>Статистика</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            selectedTab === 'collection' && styles.tabButtonActive
          ]}
          onPress={() => setSelectedTab('collection')}
        >
          <Text style={styles.tabButtonText}>Коллекция</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            selectedTab === 'activity' && styles.tabButtonActive
          ]}
          onPress={() => setSelectedTab('activity')}
        >
          <Text style={styles.tabButtonText}>Активность</Text>
        </TouchableOpacity>
      </View>
      
      {/* Контент */}
      {selectedTab === 'stats' && renderStats()}
      {selectedTab === 'collection' && renderCollection()}
      {selectedTab === 'activity' && renderActivity()}
      
      {/* Кнопка обновления */}
      <TouchableOpacity 
        style={styles.refreshButton} 
        onPress={loadProfileData}
      >
        <Text style={styles.refreshButtonText}>Обновить</Text>
      </TouchableOpacity>
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
    padding: 20,
    paddingTop: 40,
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
  currencyContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currencyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  currencyLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
    padding