// Сервис для работы с пакетами карт

import PackSystem from '../game_logic/pack_system';
import CollectionSystem from '../game_logic/collection_system';
import PLAYER_CARDS from '../game_logic/player_cards';

// Инициализация систем
const packSystem = new PackSystem();
const collectionSystem = new CollectionSystem();

// Инициализация коллекции для тестового игрока
const PLAYER_ID = 'test_player_123';
collectionSystem.initializePlayerCollection(PLAYER_ID);

// Удаляем автоматическое добавление всех карт в коллекцию
// const allCards = require('../game_logic/player_cards');
// collectionSystem.addCardsToCollection(PLAYER_ID, allCards);

export const PackService = {
  /**
   * Получение всех доступных типов пакетов
   */
  getAllPackTypes: () => {
    return packSystem.getAllPackTypes();
  },

  /**
   * Открытие пакета
   * @param {string} packTypeId - ID типа пакета
   * @returns {Object} Результат открытия пакета
   */
  openPack: (packTypeId) => {
    console.log('Opening pack:', packTypeId);
    
    // Проверка наличия валюты (упрощенная)
    const playerCurrency = collectionSystem.getPlayerCurrency(PLAYER_ID);
    console.log('Player currency:', playerCurrency);
    
    const packPrice = packSystem.getPackPrice(packTypeId);
    console.log('Pack price:', packPrice);
    
    if (playerCurrency.success && playerCurrency.currency < packPrice) {
      console.log('Not enough currency');
      return {
        success: false,
        error: 'Недостаточно средств для покупки пакета'
      };
    }
    
    // Списание валюты
    if (playerCurrency.success) {
      const spendResult = collectionSystem.spendCurrency(PLAYER_ID, packPrice);
      console.log('Spend currency result:', spendResult);
      
      if (!spendResult.success) {
        return {
          success: false,
          error: spendResult.error
        };
      }
    }
    
    // Открытие пакета
    const packResult = packSystem.openPack(packTypeId, PLAYER_CARDS);
    console.log('Pack opening result:', packResult);
    
    if (packResult.success) {
      // Добавление карт в коллекцию
      const collectionResult = collectionSystem.addCardsToCollection(PLAYER_ID, packResult.cards);
      console.log('Collection update result:', collectionResult);
      
      // Объединение результатов
      return {
        ...packResult,
        collectionResult,
        playerCurrency: collectionSystem.getPlayerCurrency(PLAYER_ID)
      };
    }
    
    return packResult;
  },

  /**
   * Получение коллекции игрока
   */
  getPlayerCollection: () => {
    return collectionSystem.getPlayerCollection(PLAYER_ID);
  },

  /**
   * Получение статистики коллекции по редкости
   */
  getCollectionStatsByRarity: () => {
    return collectionSystem.getCollectionStatsByRarity(PLAYER_ID);
  },

  /**
   * Получение статистики коллекции по позициям
   */
  getCollectionStatsByPosition: () => {
    return collectionSystem.getCollectionStatsByPosition(PLAYER_ID);
  },

  /**
   * Получение прогресса заполнения коллекции
   */
  getCollectionCompletion: () => {
    return collectionSystem.getCollectionCompletion(PLAYER_ID);
  },

  /**
   * Получение рекомендаций по дополнению коллекции
   */
  getCollectionRecommendations: () => {
    return collectionSystem.getCollectionRecommendations(PLAYER_ID);
  },

  /**
   * Получение текущей валюты игрока
   */
  getPlayerCurrency: () => {
    return collectionSystem.getPlayerCurrency(PLAYER_ID);
  },

  /**
   * Получение валюты за дубликат карты
   * @param {string} rarity - Редкость карты
   * @returns {number} Количество валюты за дубликат
   */
  getCurrencyForDuplicate: (rarity) => {
    return collectionSystem.getCurrencyForDuplicate(rarity);
  }
};