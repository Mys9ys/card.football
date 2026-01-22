// Система коллекции карт для игры "Карточный футбол"

class CollectionSystem {
  constructor() {
    this.playerCollections = new Map(); // Хранение коллекций игроков
  }

  /**
   * Инициализация коллекции для нового игрока
   */
  initializePlayerCollection(playerId) {
    if (this.playerCollections.has(playerId)) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} уже существует`
      };
    }

    this.playerCollections.set(playerId, {
      cards: [], // Массив ID карт в коллекции
      currency: 1000, // Начальная игровая валюта
      packsOpened: 0, // Количество открытых пакетов
      cardsObtained: 0, // Общее количество полученных карт
      duplicateCards: 0, // Количество дубликатов
      cardUpgrades: 0, // Количество улучшений карт
      lastUpdated: new Date().toISOString()
    });

    return {
      success: true,
      message: `Коллекция для игрока ${playerId} инициализирована`
    };
  }

  /**
   * Добавление карт в коллекцию игрока
   */
  addCardsToCollection(playerId, cards) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    const newCards = [];
    const duplicates = [];
    
    cards.forEach(card => {
      if (playerCollection.cards.includes(card.id)) {
        // Карта уже есть в коллекции - дубликат
        duplicates.push(card);
        playerCollection.duplicateCards++;
        
        // Дубликаты можно обменять на валюту или использовать для улучшения
        const currencyEarned = this.getCurrencyForDuplicate(card.rarity);
        playerCollection.currency += currencyEarned;
      } else {
        // Новая карта
        playerCollection.cards.push(card.id);
        newCards.push(card);
      }
    });

    // Обновляем статистику
    playerCollection.cardsObtained += cards.length;
    playerCollection.lastUpdated = new Date().toISOString();

    return {
      success: true,
      newCards: newCards,
      duplicates: duplicates,
      currencyEarned: duplicates.reduce((sum, card) => sum + this.getCurrencyForDuplicate(card.rarity), 0),
      totalCardsInCollection: playerCollection.cards.length,
      message: `Добавлено ${newCards.length} новых карт и ${duplicates.length} дубликатов`
    };
  }

  /**
   * Получение коллекции игрока
   */
  getPlayerCollection(playerId) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    return {
      success: true,
      collection: playerCollection
    };
  }

  /**
   * Получение валюты за дубликат карты в зависимости от редкости
   */
  getCurrencyForDuplicate(rarity) {
    const currencyValues = {
      common: 5,
      rare: 15,
      epic: 50,
      legendary: 200
    };
    
    return currencyValues[rarity] || 5;
  }

  /**
   * Получение количества карт в коллекции по редкости
   */
  getCollectionStatsByRarity(playerId) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    // Здесь предполагается, что у нас есть доступ к данным всех карт
    // В реальной реализации это будет получаться из базы данных
    const allCards = require('./player_cards'); // Имитация получения всех карт
    
    const rarityCount = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0
    };

    playerCollection.cards.forEach(cardId => {
      const card = allCards.find(c => c.id === cardId);
      if (card && rarityCount[card.rarity] !== undefined) {
        rarityCount[card.rarity]++;
      }
    });

    return {
      success: true,
      stats: rarityCount,
      total: Object.values(rarityCount).reduce((sum, count) => sum + count, 0)
    };
  }

  /**
   * Получение количества карт в коллекции по позиции
   */
  getCollectionStatsByPosition(playerId) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    const allCards = require('./player_cards'); // Имитация получения всех карт
    
    const positionCount = {
      attacker: 0,
      midfielder: 0,
      defender: 0,
      goalkeeper: 0
    };

    playerCollection.cards.forEach(cardId => {
      const card = allCards.find(c => c.id === cardId);
      if (card && positionCount[card.position] !== undefined) {
        positionCount[card.position]++;
      }
    });

    return {
      success: true,
      stats: positionCount,
      total: Object.values(positionCount).reduce((sum, count) => sum + count, 0)
    };
  }

  /**
   * Улучшение карты с использованием дубликатов
   */
  upgradeCard(playerId, cardId, duplicateCount) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    // Проверяем, есть ли карта в коллекции
    if (!playerCollection.cards.includes(cardId)) {
      return {
        success: false,
        error: `Карта ${cardId} не найдена в коллекции игрока ${playerId}`
      };
    }

    // В реальной игре улучшение карты требует определенного количества дубликатов
    // и валюты. Здесь упрощенная реализация.
    
    playerCollection.cardUpgrades++;
    playerCollection.duplicateCards -= duplicateCount;
    playerCollection.lastUpdated = new Date().toISOString();

    return {
      success: true,
      message: `Карта ${cardId} улучшена с использованием ${duplicateCount} дубликатов`,
      upgradeLevel: 1 // В реальной игре здесь был бы уровень улучшения
    };
  }

  /**
   * Получение прогресса заполнения коллекции
   */
  getCollectionCompletion(playerId) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    const allCards = require('./player_cards'); // Имитация получения всех карт
    const totalCards = allCards.length;
    const collectedCards = playerCollection.cards.length;
    const completionPercentage = (collectedCards / totalCards) * 100;

    return {
      success: true,
      totalCards: totalCards,
      collectedCards: collectedCards,
      completionPercentage: parseFloat(completionPercentage.toFixed(2)),
      message: `Коллекция заполнена на ${parseFloat(completionPercentage.toFixed(2))}%`
    };
  }

  /**
   * Получение рекомендаций по дополнению коллекции
   */
  getCollectionRecommendations(playerId) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    const allCards = require('./player_cards'); // Имитация получения всех карт
    
    // Находим недостающие карты
    const missingCards = allCards.filter(card => !playerCollection.cards.includes(card.id));
    
    // Сортируем по редкости и силе
    const recommendations = missingCards
      .sort((a, b) => {
        // Сначала по редкости (legendary > epic > rare > common)
        const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 };
        if (rarityOrder[b.rarity] !== rarityOrder[a.rarity]) {
          return rarityOrder[b.rarity] - rarityOrder[a.rarity];
        }
        
        // Затем по общей силе (атака + защита + скорость + техника)
        const totalPowerA = a.attack + a.defense + a.speed + a.technique;
        const totalPowerB = b.attack + b.defense + b.speed + b.technique;
        return totalPowerB - totalPowerA;
      })
      .slice(0, 10); // Топ-10 рекомендаций

    return {
      success: true,
      recommendations: recommendations,
      missingTotal: missingCards.length,
      message: `Найдено ${missingCards.length} недостающих карт. Топ-10 рекомендаций.`
    };
  }

  /**
   * Получение информации о валюте игрока
   */
  getPlayerCurrency(playerId) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    return {
      success: true,
      currency: playerCollection.currency,
      message: `Игрок ${playerId} имеет ${playerCollection.currency} игровой валюты`
    };
  }

  /**
   * Траты валюты
   */
  spendCurrency(playerId, amount) {
    const playerCollection = this.playerCollections.get(playerId);
    
    if (!playerCollection) {
      return {
        success: false,
        error: `Коллекция для игрока ${playerId} не найдена`
      };
    }

    if (playerCollection.currency < amount) {
      return {
        success: false,
        error: `Недостаточно средств. Требуется ${amount}, доступно ${playerCollection.currency}`
      };
    }

    playerCollection.currency -= amount;
    playerCollection.lastUpdated = new Date().toISOString();

    return {
      success: true,
      remainingCurrency: playerCollection.currency,
      spent: amount,
      message: `Потрачено ${amount} игровой валюты`
    };
  }
}

module.exports = CollectionSystem;