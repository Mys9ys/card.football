// Компонент для отображения профиля игрока

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const PlayerProfile = ({ player, onPress }) => {
  // Определение цвета фона в зависимости от редкости карты
  const getBackgroundColor = () => {
    switch (player.rarity) {
      case 'legendary':
        return '#fff3e0'; // Оранжевый для легендарных
      case 'epic':
        return '#e8f0fe'; // Синий для эпических
      case 'rare':
        return '#e8f5e8'; // Зеленый для редких
      case 'common':
      default:
        return '#f5f5f5'; // Серый
    }
  };

  // Определение цвета рамки в зависимости от редкости карты
  const getBorderColor = () => {
    switch (player.rarity) {
      case 'legendary':
        return '#FFD700'; // Золотой
      case 'epic':
        return '#8A2BE2'; // Фиолетовый
      case 'rare':
        return '#1E90FF'; // Синий
      case 'common':
      default:
        return '#CCCCCC'; // Серый
    }
  };

  // Определение названия позиции
  const getPositionName = () => {
    switch (player.position) {
      case 'attacker':
        return 'Нападающий';
      case 'midfielder':
        return 'Полузащитник';
      case 'defender':
        return 'Защитник';
      case 'goalkeeper':
        return 'Вратарь';
      default:
        return 'Позиция';
    }
  };

  // Расчет общей силы игрока
  const getTotalPower = () => {
    return player.attack + player.defense + player.speed + player.technique;
  };

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() }]} onPress={() => onPress(player)}>
      <View style={styles.header}>
        <Text style={styles.name}>{player.name}</Text>
        <Text style={styles.rarity}>{player.rarity}</Text>
      </View>
      
      <View style={styles.imageContainer}>
        {player.image ? (
          <Image 
            source={{uri: player.image}} 
            style={styles.image} 
            defaultSource={require('../assets/theme/player-bubble.jpg')}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Изображение</Text>
          </View>
        )}
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Команда:</Text>
          <Text style={styles.value}>{player.team}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Страна:</Text>
          <Text style={styles.value}>{player.country}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Позиция:</Text>
          <Text style={styles.value}>{getPositionName()}</Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Атака</Text>
          <Text style={styles.statValue}>{player.attack}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Защита</Text>
          <Text style={styles.statValue}>{player.defense}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Скорость</Text>
          <Text style={styles.statValue}>{player.speed}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Техника</Text>
          <Text style={styles.statValue}>{player.technique}</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.totalPower}>Сила: {getTotalPower()}</Text>
        {player.abilities && player.abilities.length > 0 && (
          <Text style={styles.abilities}>Способности: {player.abilities.slice(0, 2).join(', ')}</Text>
        )}
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  rarity: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    color: '#FFFFFF',
  },
  imageContainer: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  image: {
    width: 120,
    height: 160,
    borderRadius: 10,
  },
  placeholder: {
    width: 120,
    height: 160,
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 12,
  },
  infoContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#f9f9f9',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  footer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPower: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },
  abilities: {
    fontSize: 12,
    color: '#0066cc',
    textAlign: 'center',
  },
});

// Установка цветов для разных редкостей (для компонента Rarity)
styles.rarity.backgroundColor = '#FFD700';
styles.rarity.color = 'white';
styles.rarity.backgroundColor = '#8A2BE2';
styles.rarity.color = 'white';
styles.rarity.backgroundColor = '#1E90FF';
styles.rarity.color = 'white';

export default PlayerProfile;