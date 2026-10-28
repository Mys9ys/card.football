// Match screen — Bubble theme

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { PackService } from '../services/PackService';
import MatchSimulation from '../components/MatchSimulation';
import { BubbleTheme } from '../theme/bubble';

const MatchScreen = () => {
  const [playerTeam, setPlayerTeam] = useState(null);
  const [opponentTeam, setOpponentTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    loadPlayerTeam();
  }, []);

  const loadPlayerTeam = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const collectionResult = PackService.getPlayerCollection();

      if (!collectionResult.success) {
        setLoadError('Не удалось загрузить коллекцию');
        setPlayerTeam(null);
        return;
      }

      const allCards = require('../game_logic/player_cards');
      const collectionCardIds = collectionResult.collection?.cards || [];
      const collectionCards = allCards.filter((card) =>
        collectionCardIds.includes(card.id)
      );

      if (collectionCards.length === 0) {
        setPlayerTeam({});
        setOpponentTeam(null);
        return;
      }

      const team = {};
      const positions = ['attacker', 'midfielder', 'defender', 'goalkeeper'];

      positions.forEach((position) => {
        const positionCards = collectionCards.filter(
          (card) => card.position === position
        );
        const count =
          position === 'attacker'
            ? 3
            : position === 'midfielder'
              ? 3
              : position === 'defender'
                ? 4
                : 1;

        for (let i = 0; i < count; i++) {
          if (positionCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * positionCards.length);
            const card = positionCards[randomIndex];
            team[`${position}_${i}`] = card;
            positionCards.splice(randomIndex, 1);
          }
        }
      });

      setPlayerTeam(team);
      createOpponentTeam();
    } catch (error) {
      setLoadError('Не удалось загрузить данные');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createOpponentTeam = () => {
    const allCards = require('../game_logic/player_cards');
    const team = {};
    const positions = ['attacker', 'midfielder', 'defender', 'goalkeeper'];

    positions.forEach((position) => {
      const positionCards = allCards.filter((card) => card.position === position);
      const count =
        position === 'attacker'
          ? 3
          : position === 'midfielder'
            ? 3
            : position === 'defender'
              ? 4
              : 1;

      for (let i = 0; i < count; i++) {
        if (positionCards.length > 0) {
          const randomIndex = Math.floor(Math.random() * positionCards.length);
          team[`${position}_${i}`] = positionCards[randomIndex];
        }
      }
    });

    setOpponentTeam(team);
  };

  const handleMatchComplete = (result) => {
    const matchRecord = {
      id: Date.now(),
      date: new Date().toISOString(),
      opponent: 'Компьютер',
      playerScore: result.score.teamA,
      opponentScore: result.score.teamB,
      result:
        result.winner === 'teamA'
          ? 'win'
          : result.winner === 'teamB'
            ? 'loss'
            : 'draw',
      playerPower: calculateTeamPower(playerTeam),
      opponentPower: calculateTeamPower(opponentTeam),
    };

    setMatchHistory((prev) => [matchRecord, ...prev]);

    if (result.winner === 'teamA') {
      Alert.alert('Победа!', 'Вы победили и получили 100 монет!', [
        { text: 'OK' },
      ]);
    }
  };

  const calculateTeamPower = (team) => {
    if (!team) return 0;
    let totalPower = 0;
    Object.values(team).forEach((player) => {
      if (player) {
        totalPower +=
          player.attack + player.defense + player.speed + player.technique;
      }
    });
    return totalPower;
  };

  const playerCount = playerTeam
    ? Object.values(playerTeam).filter((p) => p != null).length
    : 0;

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Матч</Text>
        </View>
        <View style={styles.centerBlock}>
          <ActivityIndicator size="large" color={BubbleTheme.primary} />
          <Text style={styles.muted}>Загрузка команд...</Text>
        </View>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Матч</Text>
        </View>
        <View style={styles.centerBlock}>
          <Text style={styles.errorText}>{loadError}</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={loadPlayerTeam}>
            <Text style={styles.primaryBtnText}>Повторить</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!playerTeam || playerCount === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Матч</Text>
        </View>
        <View style={styles.centerBlock}>
          <Text style={styles.emptyTitle}>Нет состава</Text>
          <Text style={styles.muted}>
            Откройте пакеты и соберите команду, затем возвращайтесь на матч.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Матч</Text>
          <View style={styles.statsRow}>
            <Text style={styles.statsText}>
              Сила: {calculateTeamPower(playerTeam)}
            </Text>
            <Text style={styles.statsText}>Игроков: {playerCount}</Text>
          </View>
        </View>

        {playerTeam && opponentTeam ? (
          <MatchSimulation
            teamA={playerTeam}
            teamB={opponentTeam}
            onMatchComplete={handleMatchComplete}
          />
        ) : null}

        {matchHistory.length > 0 ? (
          <View style={styles.historyCard}>
            <Text style={styles.historyTitle}>История матчей</Text>
            {matchHistory.slice(0, 5).map((match) => (
              <View key={match.id} style={styles.historyItem}>
                <Text style={styles.historyText}>
                  {new Date(match.date).toLocaleDateString('ru-RU')} ·{' '}
                  {match.opponent}
                </Text>
                <Text
                  style={[
                    styles.historyText,
                    match.result === 'win' && styles.winText,
                    match.result === 'loss' && styles.lossText,
                  ]}
                >
                  {match.playerScore}:{match.opponentScore}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => {
            Alert.alert(
              'Новая игра',
              'Создать нового соперника и начать заново?',
              [
                { text: 'Отмена', style: 'cancel' },
                { text: 'Начать', onPress: () => loadPlayerTeam() },
              ]
            );
          }}
        >
          <Text style={styles.primaryBtnText}>Новая игра</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BubbleTheme.bg,
  },
  scrollContent: {
    paddingBottom: 28,
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
    fontWeight: '800',
    color: BubbleTheme.text,
    textAlign: 'center',
  },
  statsRow: {
    marginTop: 10,
    alignItems: 'center',
    gap: 4,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: BubbleTheme.muted,
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  muted: {
    marginTop: 10,
    fontSize: 15,
    color: BubbleTheme.muted,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: BubbleTheme.text,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '700',
    color: BubbleTheme.text,
    textAlign: 'center',
  },
  historyCard: {
    margin: 16,
    padding: 16,
    backgroundColor: BubbleTheme.card,
    borderRadius: BubbleTheme.radius,
    borderWidth: 1,
    borderColor: BubbleTheme.line,
  },
  historyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: BubbleTheme.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: BubbleTheme.line,
  },
  historyText: {
    fontSize: 14,
    fontWeight: '600',
    color: BubbleTheme.muted,
  },
  winText: {
    color: '#2E9E5B',
    fontWeight: '800',
  },
  lossText: {
    color: BubbleTheme.primary,
    fontWeight: '800',
  },
  primaryBtn: {
    backgroundColor: BubbleTheme.primary,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 15,
    borderRadius: 999,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: BubbleTheme.onPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default MatchScreen;
