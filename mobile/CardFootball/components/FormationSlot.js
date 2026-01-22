// Компонент для отображения слота в схеме расстановки

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const FormationSlot = ({ position, player, onSlotPress, isAvailable }) => {
  // Определение цвета фона в зависимости от позиции
  const getBackgroundColor = () => {
    if (player) return '#e8f5e8'; // Зеленый для заполненного слота
    if (!isAvailable) return '#ffebee'; // Красный для недоступного слота
    return '#f5f5f5'; // Серый для пустого доступного слота
  };

  // Определение цвета рамки в зависимости от позиции
  const getBorderColor = () => {
    switch (position) {
      case 'attacker':
        return '#f44336'; // Красный для нападающих
      case 'midfielder':
        return '#4CAF50'; // Зеленый для полузащитников
      case 'defender':
        return '#2196F3'; // Синий для защитников
      case 'goalkeeper':
        return '#FF9800'; // Оранжевый для вратаря
      default:
        return '#9E9E9E'; // Серый
    }
  };

  // Определение названия позиции
  const getPositionName = () => {
    switch (position) {
      case 'attacker':
        return 'Н';
      case 'midfielder':
        return 'П';
      case 'defender':
        return 'З';
      case 'goalkeeper':
        return 'В';
      default:
        return '';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor()
        }
      ]} 
      onPress={() => onSlotPress(position)}
      disabled={!isAvailable && !player}
    >
      {player ? (
        <View style={styles.playerContainer}>
          <Text style={styles.playerName} numberOfLines={1}>
            {player.name}
          </Text>
          <Text style={styles.playerPosition}>
            {player.position === 'attacker' ? 'Н' :
             player.position === 'midfielder' ? 'П' :
             player.position === 'defender' ? 'З' : 'В'}
          </Text>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.positionLabel}>
            {getPositionName()}
          </Text>
          {!isAvailable && (
            <Text style={styles.unavailableText}>Недоступно</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    borderWidth: 2,
    borderRadius: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerContainer: {
    alignItems: 'center',
    padding: 5,
  },
  playerName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    maxWidth: '100%',
  },
  playerPosition: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
  },
  positionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  unavailableText: {
    fontSize: 10,
    color: '#f44336',
    marginTop: 2,
  },
});

export default FormationSlot;