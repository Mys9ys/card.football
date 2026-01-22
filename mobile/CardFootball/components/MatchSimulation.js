// Компонент для симуляции матча

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

const MatchSimulation = ({ teamA, teamB, onMatchComplete }) => {
  const [matchLog, setMatchLog] = useState([]);
  const [currentMinute, setCurrentMinute] = useState(0);
  const [score, setScore] = useState({ teamA: 0, teamB: 0 });
  const [isMatchRunning, setIsMatchRunning] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  // Симуляция матча
  useEffect(() => {
    if (!isMatchRunning || currentMinute >= 90) return;

    const timer = setTimeout(() => {
      simulateMinute();
      setCurrentMinute(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isMatchRunning, currentMinute]);

  // Симуляция одной минуты матча
  const simulateMinute = () => {
    // Определение силы команд
    const teamAPower = calculateTeamPower(teamA);
    const teamBPower = calculateTeamPower(teamB);
    
    // Определение шансов на гол
    const totalPower = teamAPower + teamBPower;
    const chanceA = teamAPower / totalPower;
    const chanceB = teamBPower / totalPower;
    
    // Симуляция события
    const random = Math.random();
    
    if (random < chanceA * 0.03) { // 3% шанс на гол для более сильной команды
      setScore(prev => ({ ...prev, teamA: prev.teamA + 1 }));
      setMatchLog(prev => [...prev, `\n${currentMinute + 1}' - ГОЛ! ${getRandomPlayer(teamA).name} забивает для команды А!`]);
    } else if (random < (chanceA * 0.03) + (chanceB * 0.03)) {
      setScore(prev => ({ ...prev, teamB: prev.teamB + 1 }));
      setMatchLog(prev => [...prev, `\n${currentMinute + 1}' - ГОЛ! ${getRandomPlayer(teamB).name} забивает для команды B!`]);
    } else if (random < 0.1) {
      setMatchLog(prev => [...prev, `\n${currentMinute + 1}' - ${getRandomPlayer(teamA).name} делает опасный проход!`]);
    } else if (random < 0.2) {
      setMatchLog(prev => [...prev, `\n${currentMinute + 1}' - ${getRandomPlayer(teamB).name} контролирует мяч в центре поля`]);
    }
    
    // Проверка окончания матча
    if (currentMinute + 1 >= 90) {
      endMatch();
    }
  };

  // Окончание матча
  const endMatch = () => {
    setIsMatchRunning(false);
    
    const result = {
      score: { ...score },
      winner: score.teamA > score.teamB ? 'teamA' : score.teamB > score.teamA ? 'teamB' : 'draw',
      matchLog: matchLog
    };
    
    setMatchResult(result);
    
    // Уведомление о результате
    let message = `Матч завершен! Счет: ${score.teamA}:${score.teamB}\n\n`;
    if (result.winner === 'draw') {
      message += 'Ничья!';
    } else {
      message += `Победитель: Команда ${result.winner === 'teamA' ? 'A' : 'B'}!`;
    }
    
    Alert.alert('Результат матча', message);
    
    // Вызов обратного вызова
    if (onMatchComplete) {
      onMatchComplete(result);
    }
  };

  // Расчет силы команды
  const calculateTeamPower = (team) => {
    if (!team || Object.keys(team).length === 0) return 0;
    
    let totalPower = 0;
    Object.values(team).forEach(player => {
      if (player) {
        totalPower += player.attack + player.defense + player.speed + player.technique;
      }
    });
    return totalPower;
  };

  // Получение случайного игрока из команды
  const getRandomPlayer = (team) => {
    const players = Object.values(team).filter(p => p !== null);
    if (players.length === 0) return { name: 'Неизвестный игрок' };
    return players[Math.floor(Math.random() * players.length)];
  };

  // Запуск матча
  const startMatch = () => {
    if (!teamA || !teamB) {
      Alert.alert('Ошибка', 'Необходимо выбрать обе команды для матча');
      return;
    }
    
    setMatchLog([`Матч начинается! Команда А против Команды B`]);
    setCurrentMinute(0);
    setScore({ teamA: 0, teamB: 0 });
    setMatchResult(null);
    setIsMatchRunning(true);
  };

  // Прерывание матча
  const stopMatch = () => {
    setIsMatchRunning(false);
    Alert.alert('Матч прерван', `Матч был прерван на ${currentMinute}' минуте. Счет: ${score.teamA}:${score.teamB}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Симуляция матча</Text>
      
      {/* Информация о командах */}
      <View style={styles.teamsContainer}>
        <View style={styles.teamInfo}>
          <Text style={styles.teamLabel}>Команда A</Text>
          <Text style={styles.teamPower}>Сила: {calculateTeamPower(teamA)}</Text>
        </View>
        <Text style={styles.vs}>-</Text>
        <View style={styles.teamInfo}>
          <Text style={styles.teamLabel}>Команда B</Text>
          <Text style={styles.teamPower}>Сила: {calculateTeamPower(teamB)}</Text>
        </View>
      </View>
      
      {/* Счет */}
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{score.teamA}</Text>
        <Text style={styles.vs}>:</Text>
        <Text style={styles.score}>{score.teamB}</Text>
      </View>
      
      {/* Таймер */}
      <Text style={styles.timer}>{currentMinute}'</Text>
      
      {/* Кнопки управления */}
      <View style={styles.buttonsContainer}>
        {!isMatchRunning ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startButton} onPress={startMatch}>
              <Text style={styles.buttonText}>Начать матч</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.stopButton} onPress={stopMatch}>
              <Text style={styles.buttonText}>Прервать</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Лог матча */}
      {matchLog.length > 0 && (
        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>Лог матча:</Text>
          <Text style={styles.logText}>{matchLog.join('')}</Text>
        </View>
      )}
      
      {/* Результат матча */}
      {matchResult && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Результат:</Text>
          <Text style={styles.resultText}>Счет: {matchResult.score.teamA}:{matchResult.score.teamB}</Text>
          <Text style={styles.resultText}>
            Победитель: {matchResult.winner === 'draw' ? 'Ничья' : matchResult.winner === 'teamA' ? 'Команда A' : 'Команда B'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  teamInfo: {
    flex: 1,
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  teamPower: {
    fontSize: 14,
    color: '#666',
  },
  vs: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 10,
  },
  timer: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  buttonsContainer: {
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  stopButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  logTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  logText: {
    fontSize: 12,
    color: '#666',
  },
  resultContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#e8f5e8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default MatchSimulation;