// Экран составления команды

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, Modal, Image, Dimensions, ActivityIndicator } from 'react-native';
import { PackService } from '../services/PackService';
import FormationSlot from '../components/FormationSlot';
import AvailableCardsModal from '../components/AvailableCardsModal';
// Импорт компонента выбора схемы, который мы забыли импортировать
import FormationSelector from '../components/FormationSelector';

// Импорт системы коллекции для добавления карты расстановки
const CollectionSystem = require('../game_logic/collection_system');
const collectionSystem = new CollectionSystem();
const PLAYER_ID = 'test_player_123';

const TeamFormationScreen = () => {
  // Данные о коллекции
  const [collection, setCollection] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Состояние команды
  const [team, setTeam] = useState({});
  const [selectedFormation, setSelectedFormation] = useState('4-4-2');
  
  // Модальные окна
  const [formationModalVisible, setFormationModalVisible] = useState(false);
  const [availableCardsModalVisible, setAvailableCardsModalVisible] = useState(false);
  const [selectedSlotPosition, setSelectedSlotPosition] = null;
  
  // Загрузка данных коллекции
  useEffect(() => {
    loadCollection();
  }, []);

  // Инициализация команды по умолчанию после загрузки коллекции
  useEffect(() => {
    if (!loading && cards && cards.length > 0 && Object.keys(team).length === 0) {
      initializeTeam('4-4-2');
    }
  }, [loading, cards, team]);

  const loadCollection = async () => {
    try {
      setLoading(true);
      
      // Получение данных из сервиса
      const collectionResult = PackService.getPlayerCollection();
      
      if (collectionResult.success) {
        setCollection(collectionResult.collection);
        
        // Получение всех карт
        const allCardsRaw = require('../game_logic/player_cards');
        const allCards = Array.isArray(allCardsRaw) ? allCardsRaw : [];
        const collectionCardIds = collectionResult.collection.cards || [];
        
        // Фильтрация карт в коллекции
        const collectionCards = Array.isArray(allCards) && Array.isArray(collectionCardIds) 
          ? allCards.filter(card => collectionCardIds.includes(card.id))
          : [];
        
        setCards(collectionCards);
        
        // Проверка наличия карты расстановки 4-4-2
        const formationCards = collectionCards.filter(card => card.position === 'formation');
        if (formationCards.length === 0) {
            // Если нет карты расстановки, добавляем расстановку 4-4-2
          const allFormations = require('../game_logic/card_types').CARD_TYPES.FORMATIONS;
          const defaultFormation = allFormations['4-4-2'];
          
          // Добавляем карту расстановки в коллекцию
          const result = collectionSystem.addCardsToCollection(PLAYER_ID, [{
            id: 'formation_4-4-2',
            name: 'Расстановка 4-4-2',
            position: 'formation',
            team: 'Default',
            country: 'World',
            attack: 50,
            defense: 50,
            speed: 50,
            technique: 50,
            stamina: 50,
            rarity: 'common',
            abilities: ['formation_4-4-2'],
            image: require('../assets/formation/4-4-2.png'),
            description: 'Классическая сбалансированная схема'
          }]);
          
          if (result.success) {
            console.log('Карта расстановки 4-4-2 добавлена в коллекцию');
            // Обновляем коллекцию
            const updatedCollectionResult = PackService.getPlayerCollection();
            setCollection(updatedCollectionResult.collection);
            setCards([...cards, ...result.newCards]);
          } else {
            console.error('Не удалось добавить карту расстановки:', result.error);
          }
        }
        
        // Добавление тестовых карт в коллекцию при первом запуске
        if (collectionCardIds.length <= 1) { // Если только карта расстановки или пустая коллекция
          const testCards = [
            {
              id: 'test_player_001',
              name: 'Тестовый Нападающий',
              position: 'attacker',
              team: 'Test Team',
              country: 'Test Country',
              attack: 85,
              defense: 70,
              speed: 80,
              technique: 82,
              stamina: 78,
              rarity: 'rare',
              abilities: ['dribbling', 'long_shot'],
              image: require('../assets/images/default_player.png'),
              description: 'Тестовая карта нападающего для проверки функциональности'
            },
            {
              id: 'test_player_002',
              name: 'Тестовый Полузащитник',
              position: 'midfielder',
              team: 'Test Team',
              country: 'Test Country',
              attack: 78,
              defense: 75,
              speed: 77,
              technique: 88,
              stamina: 85,
              rarity: 'rare',
              abilities: ['cross', 'support'],
              image: require('../assets/images/default_player.png'),
              description: 'Тестовая карта полузащитника для проверки функциональности'
            },
            {
              id: 'test_player_003',
              name: 'Тестовый Защитник',
              position: 'defender',
              team: 'Test Team',
              country: 'Test Country',
              attack: 65,
              defense: 88,
              speed: 72,
              technique: 70,
              stamina: 80,
              rarity: 'rare',
              abilities: ['blocking', 'tackle'],
              image: require('../assets/images/default_player.png'),
              description: 'Тестовая карта защитника для проверки функциональности'
            },
            {
              id: 'test_player_004',
              name: 'Тестовый Вратарь',
              position: 'goalkeeper',
              team: 'Test Team',
              country: 'Test Country',
              attack: 50,
              defense: 85,
              speed: 70,
              technique: 78,
              stamina: 75,
              rarity: 'rare',
              abilities: ['blocking', 'clearance'],
              image: require('../assets/images/default_player.png'),
              description: 'Тестовая карта вратаря для проверки функциональности'
            }
          ];
          
          const testResult = collectionSystem.addCardsToCollection(PLAYER_ID, testCards);
          
          if (testResult.success) {
            console.log('Тестовые карты добавлены в коллекцию:', testResult.newCards);
            // Обновляем коллекцию
            const updatedCollectionResult = PackService.getPlayerCollection();
            console.log('Обновленная коллекция:', updatedCollectionResult);
            setCollection(updatedCollectionResult.collection);
            setCards([...cards, ...testResult.newCards]);
          } else {
            console.error('Не удалось добавить тестовые карты:', testResult.error);
          }
        }
        
        // Инициализация команды по умолчанию
        initializeTeam('4-4-2');
      } else {
        Alert.alert('Ошибка', 'Не удалось загрузить коллекцию');
      }
      
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить коллекцию');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Получение размеров экрана
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  // Размеры футбольного поля
  const fieldWidth = windowWidth * 0.9;
  const fieldHeight = windowHeight * 0.6;
  const fieldAspectRatio = 2; // Соотношение сторон поля (длина/ширина)

  // Вычисляем размеры поля с учетом соотношения сторон
  const actualFieldHeight = Math.min(fieldHeight, fieldWidth / fieldAspectRatio);
  const actualFieldWidth = actualFieldHeight * fieldAspectRatio;

  // Позиции для игроков на поле (в процентах от размера поля)
  const getPlayerPosition = (position, index, total) => {
    const margin = 10; // Отступ от краев поля
    const spacing = (100 - margin * 2) / (total + 1);
    
    switch (position) {
      case 'goalkeeper':
        return {
          left: 50,
          top: 5
        };
      case 'defender':
        return {
          left: margin + spacing * (index + 1),
          top: 25
        };
      case 'midfielder':
        return {
          left: margin + spacing * (index + 1),
          top: 50
        };
      case 'attacker':
        return {
          left: margin + spacing * (index + 1),
          top: 75
        };
      default:
        return {
          left: 50,
          top: 50
        };
    }
  };

  // Инициализация команды по схеме
  const initializeTeam = (formationId) => {
    if (loading) return;
    
    const formations = require('../game_logic/card_types').CARD_TYPES.FORMATIONS;
    const formation = formations[formationId];
    
    if (!formation) return;
    
    const newTeam = {};
    
    // Добавление вратаря
    for (let i = 0; i < formation.players.goalkeeper; i++) {
      newTeam[`goalkeeper_${i}`] = null;
    }
    
    // Добавление защитников
    for (let i = 0; i < formation.players.defenders; i++) {
      newTeam[`defender_${i}`] = null;
    }
    
    // Добавление полузащитников
    for (let i = 0; i < formation.players.midfielders; i++) {
      newTeam[`midfielder_${i}`] = null;
    }
    
    // Добавление нападающих
    for (let i = 0; i < formation.players.attackers; i++) {
      newTeam[`attacker_${i}`] = null;
    }
    
    setTeam(newTeam);
    setSelectedFormation(formationId);
  };

  // Обработка выбора схемы
  const handleFormationSelect = (formationId) => {
    setSelectedFormation(formationId);
    initializeTeam(formationId);
    setFormationModalVisible(false);
  };

  // Обработка нажатия на слот
  const handleSlotPress = (position) => {
    // Находим соответствующий слот в команде
    const slotKey = Object.keys(team).find(key => key.startsWith(`${position}_`));
    
    if (slotKey) {
      setSelectedSlotPosition(position);
      setAvailableCardsModalVisible(true);
    }
  };

  // Обработка выбора карты
  const handleCardSelect = (card) => {
    // Находим первый свободный слот для этой позиции
    const slotKey = Object.keys(team).find(key => 
      key.startsWith(`${selectedSlotPosition}_`) && !team[key]
    );
    
    if (slotKey) {
      setTeam({
        ...team,
        [slotKey]: card
      });
    }
  };

  // Удаление игрока из слота
  const removePlayer = (slotKey) => {
    Alert.alert(
      'Удалить игрока',
      'Вы уверены, что хотите удалить этого игрока из состава?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          onPress: () => {
            setTeam({
              ...team,
              [slotKey]: null
            });
          },
          style: 'destructive'
        }
      ]
    );
  };

  // Получение количества игроков для позиции
  const getPositionCount = (position) => {
    const formations = require('../game_logic/card_types').CARD_TYPES.FORMATIONS;
    const formation = formations[selectedFormation];
    
    if (!formation) return 0;
    
    switch (position) {
      case 'goalkeeper':
        return formation.players.goalkeeper;
      case 'defender':
        return formation.players.defenders;
      case 'midfielder':
        return formation.players.midfielders;
      case 'attacker':
        return formation.players.attackers;
      default:
        return 0;
    }
  };

  // Рассчет общей силы команды
  const getTeamPower = () => {
    let totalPower = 0;
    Object.values(team).forEach(player => {
      if (player) {
        totalPower += player.attack + player.defense + player.speed + player.technique;
      }
    });
    return totalPower;
  };

  // Проверка комплектации команды
  const isTeamComplete = () => {
    return Object.values(team).every(player => player !== null);
  };

  // Получение карты расстановки из коллекции
  const getFormationCard = () => {
    return cards.find(card => card.position === 'formation');
  };

  // Рендер слотов для позиции
  const renderPositionSlots = (position) => {
    if (!team) return [];
    
    const count = getPositionCount(position);
    const slots = [];
    
    for (let i = 0; i < count; i++) {
      const slotKey = `${position}_${i}`;
      const player = team[slotKey];
      
      slots.push(
        <FormationSlot
          key={slotKey}
          position={position}
          player={player}
          onSlotPress={handleSlotPress}
          isAvailable={true}
        />
      );
    }
    
    return slots;
  };

  // Рендер загрузки
  if (loading || !cards) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Состав команды</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Загрузка коллекции...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.title}>Состав команды</Text>
        
        {/* Кнопка выбора схемы */}
        <TouchableOpacity 
          style={styles.formationButton} 
          onPress={() => setFormationModalVisible(true)}
        >
          <Text style={styles.formationButtonText}>{selectedFormation}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Статистика команды */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{getTeamPower()}</Text>
          <Text style={styles.statLabel}>Сила команды</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{Object.values(team).filter(p => p !== null).length}/{Object.keys(team).length}</Text>
          <Text style={styles.statLabel}>Игроков</Text>
        </View>
      </View>
      
      {/* Футбольное поле */}
      <View style={styles.fieldContainer}>
        <Image
          source={require('../assets/images/field.png')}
          style={[
            styles.fieldImage,
            { width: actualFieldWidth, height: actualFieldHeight }
          ]}
          resizeMode="stretch"
        />
        
        {/* Слоты для игроков */}
        {Object.entries(team).map(([slotKey, player]) => {
          const position = slotKey.split('_')[0];
          const index = parseInt(slotKey.split('_')[1]);
          const total = getPositionCount(position);
          
          const playerPos = getPlayerPosition(position, index, total);
          
          return (
            <TouchableOpacity
              key={slotKey}
              style={[
                styles.playerSlot,
                {
                  left: `${playerPos.left}%`,
                  top: `${playerPos.top}%`,
                  transform: [{ translateX: -25 }, { translateY: -25 }]
                }
              ]}
              onPress={() => handleSlotPress(position)}
            >
              <FormationSlot
                position={position}
                player={player}
                onSlotPress={() => {}}
                isAvailable={true}
                size={50}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Кнопка сохранения */}
      <TouchableOpacity 
        style={[
          styles.saveButton, 
          !isTeamComplete() && styles.saveButtonDisabled
        ]}
        onPress={() => {
          if (isTeamComplete()) {
            Alert.alert('Команда сохранена', 'Ваш состав успешно сохранен!');
          } else {
            Alert.alert('Команда не готова', 'Заполните все слоты, чтобы сохранить состав');
          }
        }}
        disabled={!isTeamComplete()}
      >
        <Text style={styles.saveButtonText}>Сохранить состав</Text>
      </TouchableOpacity>
      
      {/* Модальное окно выбора схемы */}
      <FormationSelector
        visible={formationModalVisible}
        onClose={() => setFormationModalVisible(false)}
        selectedFormation={selectedFormation}
        onFormationSelect={handleFormationSelect}
      />
      
      {/* Модальное окно выбора карты */}
      <AvailableCardsModal
        visible={availableCardsModalVisible}
        onClose={() => setAvailableCardsModalVisible(false)}
        availableCards={cards}
        onCardSelect={handleCardSelect}
        position={selectedSlotPosition}
      />
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
  formationButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  formationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    marginHorizontal: 20,
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
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldImage: {
    position: 'absolute',
    zIndex: -1,
  },
  playerSlot: {
    position: 'absolute',
    width: 50,
    height: 50,
  },
  saveButton: {
    backgroundColor: '#0066cc',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
});

export default TeamFormationScreen;
