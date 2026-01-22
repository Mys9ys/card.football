// Экран матча

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { PackService } from '../services/PackService';
import MatchSimulation from '../components/MatchSimulation';

const MatchScreen = () => {
  const [playerTeam, setPlayerTeam] = useState(null);
  const [opponentTeam, setOpponentTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [matchHistory, setMatchHistory] = useState([]);
  
  // Загрузка команды игрока
  useEffect(() => {
    loadPlayerTeam();
  }, []);

  const loadPlayerTeam = async () => {
    try {
      setLoading(true);
      
      // Получение данных из сервиса
      const collectionResult = PackService.getPlayerCollection();
      
      if (collectionResult.success) {
        // Получение всех карт
        const allCards = require('../game_logic/player_cards');
        const collectionCardIds = collectionResult.collection?.cards || [];
        
        // Фильтрация карт в коллекции
        const collectionCards = allCards.filter(card => 
          collectionCardIds.includes(card.id)
        );
        
        // Создание команды из случайных карт (в реальности это должна быть сохраненная команда)
        const team = {};
        const positions = ['attacker', 'midfielder', 'defender', 'goalkeeper'];
        
        positions.forEach(position => {
          const positionCards = collectionCards.filter(card => card.position === position);
          const count = position === 'attacker' ? 3 : position === 'midfielder' ? 3 : position === 'defender' ? 4 : 1;
          
          for (let i = 0; i < count; i++) {
            if (positionCards.length > 0) {
              const randomIndex = Math.floor(Math.random() * positionCards.length);
              const card = positionCards[randomIndex];
              team[`${position}_${i}`] = card;
              // Удаляем карту из массива, чтобы не выбрать ее дважды
              positionCards.splice(randomIndex, 1);
            }
          }
        });
        
        setPlayerTeam(team);
        
        // Создание случайной команды соперника
        createOpponentTeam(collectionCards);
      } else {
        Alert.alert('Ошибка', 'Не удалось загрузить коллекцию');
      }
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Создание команды соперника
  const createOpponentTeam = (playerCards) => {
    const allCards = require('../game_logic/player_cards');
    const team = {};
    const positions = ['attacker', 'midfielder', 'defender', 'goalkeeper'];
    
    positions.forEach(position => {
      const positionCards = allCards.filter(card => card.position === position);
      const count = position === 'attacker' ? 3 : position === 'midfielder' ? 3 : position === 'defender' ? 4 : 1;
      
      for (let i = 0; i < count; i++) {
        if (positionCards.length > 0) {
          const randomIndex = Math.floor(Math.random() * positionCards.length);
          team[`${position}_${i}`] = positionCards[randomIndex];
        }
      }
    });
    
    setOpponentTeam(team);
  };

  // Обработка завершения матча
  const handleMatchComplete = (result) => {
    // Сохранение результатов в историю
    const matchRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      opponent: 'Компьютер',
      playerScore: result.score.teamA,
      opponentScore: result.score.teamB,
      result: result.winner === 'teamA' ? 'win' : result.winner === 'teamB' ? 'loss' : 'draw',
      playerPower: calculateTeamPower(playerTeam),
      opponentPower: calculateTeamPower(opponentTeam)
    };
    
    setMatchHistory(prev => [matchRecord, ...prev]);
    
    // Награда за победу
    if (result.winner === 'teamA') {
      Alert.alert('Победа!', 'Вы победили и получили 100 монет!', [
        { text: 'OK' }
      ]);
      // В реальности здесь должен быть вызов сервиса для начисления награды
    }
  };

  // Расчет силы команды
  const calculateTeamPower = (team) => {
    if (!team) return 0;
    
    let totalPower = 0;
    Object.values(team).forEach(player => {
      if (player) {
        totalPower += player.attack + player.defense + player.speed + player.technique;
      }
    });
    return totalPower;
  };

  // Рендер загрузки
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Матч</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Загрузка команд...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Матч</Text>
        
        {/* Статистика команды */}
        {playerTeam && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>Сила команды: {calculateTeamPower(playerTeam)}</Text>
            <Text style={styles.statsText}>Игроков: {Object.values(playerTeam).filter(p => p !== null).length}</Text>
          </View>
        )}
      </View>
      
      {/* Симуляция матча */}
      {playerTeam && opponentTeam && (
        <MatchSimulation 
          teamA={playerTeam} 
          teamB={opponentTeam} 
          onMatchComplete={handleMatchComplete} 
        />
      )}
      
      {/* История матчей */}
      {matchHistory.length > 0 && (
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>История матчей:</Text>
          {matchHistory.slice(0, 5).map(match => (
            <View key={match.id} style={styles.historyItem}>
              <Text style={styles.historyText}>
                {new Date(match.date).toLocaleDateString()} - {match.opponent}
              </Text>
              <Text style={[
                styles.historyText, 
                match.result === 'win' && styles.winText,
                match.result === 'loss' && styles.lossText
              ]}>
                {match.playerScore}:{match.opponentScore} ({match.result === 'win' ? 'Победа' : match.result === 'loss' ? 'Поражение' : 'Ничья'})
              </Text>
            </View>
          ))}
        </View>
      )}
      
      {/* Кнопка новой игры */}
      <TouchableOpacity 
        style={styles.newGameButton} 
        onPress={() => {
          Alert.alert(
            'Новая игра',
            'Вы уверены, что хотите начать новую игру? Это создаст новую команду соперника.',
            [
              { text: 'Отмена', style: 'cancel' },
              {
                text: 'Начать',
                onPress: () => loadPlayerTeam()
              }
            ]
          );
        }}
      >
        <Text style={styles.newGameButtonText}>Новая игра</Text>
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
  historyContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  historyText: {
    fontSize: 14,
    color: '#666',
  },
  winText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  lossText: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  newGameButton: {
    backgroundColor: '#0066cc',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  newGameButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MatchScreen;