// Компонент для отображения карточки игрока

import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Animated } from 'react-native';

const CardItem = ({ card, onPress }) => {
  // Анимация масштабирования при нажатии
  const scaleValue = new Animated.Value(1);
  
  // Обработка нажатия с анимацией
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Определение цветовых стилей в зависимости от редкости карты
  const cardColors = useMemo(() => {
    const colors = {
      legendary: {
        border: '#FFD700',
        background: '#FFF8DC',
        shadow: '#d4af37',
        text: '#8B4513',
        badge: '#FFD700'
      },
      epic: {
        border: '#8A2BE2',
        background: '#F0E6FF',
        shadow: '#6a1cb2',
        text: '#4B0082',
        badge: '#8A2BE2'
      },
      rare: {
        border: '#1E90FF',
        background: '#E6F3FF',
        shadow: '#104e8b',
        text: '#0066cc',
        badge: '#1E90FF'
      },
      common: {
        border: '#CCCCCC',
        background: '#F8F8F8',
        shadow: '#a9a9a9',
        text: '#333',
        badge: '#CCCCCC'
      }
    };
    
    return colors[card.rarity] || colors.common;
  }, [card.rarity]);

  // Определение названия позиции
  const getPositionName = () => {
    switch (card.position) {
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

  // Получение иконки позиции
  const getPositionIcon = () => {
    switch (card.position) {
      case 'attacker':
        return '⚡';
      case 'midfielder':
        return '🔄';
      case 'defender':
        return '🛡️';
      case 'goalkeeper':
        return '🧤';
      default:
        return '⚽';
    }
  };

  // Получение иконки редкости
  const getRarityIcon = () => {
    switch (card.rarity) {
      case 'legendary':
        return '⭐⭐⭐';
      case 'epic':
        return '⭐⭐';
      case 'rare':
        return '⭐';
      default:
        return '🔸';
    }
  };

  // Рассчет общего рейтинга
  const getOverallRating = () => {
    const total = card.attack + card.defense + card.speed + card.technique;
    return Math.round(total / 4);
  };

  // Получение стиля для значка редкости
  const getRarityBadgeStyle = useMemo(() => {
    return {
      backgroundColor: cardColors.badge,
      opacity: 0.2
    };
  }, [cardColors]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            borderColor: cardColors.border,
            backgroundColor: cardColors.background,
            shadowColor: cardColors.shadow
          }
        ]} 
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View style={styles.cardContent}>
        <View style={[styles.content, { backgroundColor: 'transparent' }]}>
        <View style={styles.header}>
          <Text style={styles.name}>{card.name}</Text>
          <View style={[styles.rarityBadge, getRarityBadgeStyle]}>
              <Text style={styles.rarityText}>{getRarityIcon()}</Text>
            </View>
        </View>
        
        <View style={styles.imageContainer}>
          {card.image ? (
            <Image 
              source={{uri: card.image}} 
              style={styles.image} 
              defaultSource={require('../assets/images/default_player.png')}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Изображение</Text>
            </View>
          )}
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.teamContainer}>
            <Text style={styles.team}>{card.team}</Text>
            <Text style={styles.country}>{card.country}</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Атака</Text>
              <Text style={styles.statValue}>{card.attack}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Защита</Text>
              <Text style={styles.statValue}>{card.defense}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Скорость</Text>
              <Text style={styles.statValue}>{card.speed}</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Техника</Text>
              <Text style={styles.statValue}>{card.technique}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.position}>{getPositionName()}</Text>
          {card.abilities && card.abilities.length > 0 && (
            <View style={styles.abilitiesContainer}>
              {card.abilities.slice(0, 2).map((ability, index) => (
                <Text key={index} style={styles.ability}>{ability}</Text>
              ))}
            </View>
          )}
        </View>
      </View>
      </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
cardContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    overflow: 'hidden'
},
  rarityBadge: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
  },
      rarityText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#8B4513'
  },
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
  content: {
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
  },
  rarity: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamContainer: {
    flex: 1,
  },
  team: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  country: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    width: 50,
  },
  statValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    width: 30,
    textAlign: 'right',
  },
  footer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  position: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  abilitiesContainer: {
    flexDirection: 'row',
  },
  ability: {
    fontSize: 12,
    color: '#0066cc',
    marginLeft: 10,
  },
});

// Установка цветов для разных редкостей
// Удалены прямые манипуляции со стилями, которые вызывали ошибку
// Вместо этого цвета задаются через объект стилей в render

export default CardItem;