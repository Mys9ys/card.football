// Система коллекции карт для игры "Карточный футбол"
// Upgrade costs: docs/mechanics/card-upgrade.md

const UPGRADE_COSTS = Object.freeze({
  common: [
    { duplicates: 2, currency: 20 },
    { duplicates: 3, currency: 50 },
    { duplicates: 5, currency: 100 }
  ],
  rare: [
    { duplicates: 2, currency: 50 },
    { duplicates: 3, currency: 120 },
    { duplicates: 4, currency: 250 }
  ],
  epic: [
    { duplicates: 2, currency: 150 },
    { duplicates: 3, currency: 350 },
    { duplicates: 4, currency: 700 }
  ],
  legendary: [
    { duplicates: 1, currency: 400 },
    { duplicates: 2, currency: 900 },
    { duplicates: 3, currency: 1800 }
  ]
});

const STAT_BONUS_PER_LEVEL = Object.freeze({
  common: 2,
  rare: 3,
  epic: 4,
  legendary: 5
});

const MAX_CARD_LEVEL = 3;

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
      duplicateCards: 0, // Количество дубликатов (сумма)
      cardDuplicates: {}, // { [cardId]: count }
      cardLevels: {}, // { [cardId]: 0..3 }
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
    
    if (!playerCollection.cardDuplicates) {
      playerCollection.cardDuplicates = {};
    }
    if (!playerCollection.cardLevels) {
      playerCollection.cardLevels = {};
    }

    cards.forEach(card => {
      if (playerCollection.cards.includes(card.id)) {
        // Карта уже есть — дубликат (валюта + запас для апгрейда)
        duplicates.push(card);
        playerCollection.duplicateCards++;
        playerCollection.cardDuplicates[card.id] =
          (playerCollection.cardDuplicates[card.id] || 0) + 1;

        const currencyEarned = this.getCurrencyForDuplicate(card.rarity);
        playerCollection.currency += currencyEarned;
      } else {
        playerCollection.cards.push(card.id);
        playerCollection.cardLevels[card.id] = 0;
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

  getCardLevel(playerId, cardId) {
    const playerCollection = this.playerCollections.get(playerId);
    if (!playerCollection || !playerCollection.cards.includes(cardId)) {
      return 0;
    }
    if (!playerCollection.cardLevels) {
      playerCollection.cardLevels = {};
    }
    return playerCollection.cardLevels[cardId] || 0;
  }

  getUpgradeCost(rarity, nextLevel) {
    const ladder = UPGRADE_COSTS[rarity];
    if (!ladder || nextLevel < 1 || nextLevel > MAX_CARD_LEVEL) {
      return null;
    }
    return ladder[nextLevel - 1];
  }

  getStatBonusPerLevel(rarity) {
    return STAT_BONUS_PER_LEVEL[rarity] || 0;
  }

  /**
   * Эффективные статы с учётом уровня карты.
   * card — объект из player_cards (базовые числа).
   */
  getEffectiveStats(playerId, card) {
    const level = this.getCardLevel(playerId, card.id);
    const bonus = this.getStatBonusPerLevel(card.rarity) * level;
    return {
      attack: (card.attack || 0) + bonus,
      defense: (card.defense || 0) + bonus,
      speed: (card.speed || 0) + bonus,
      technique: (card.technique || 0) + bonus,
      level
    };
  }

  /**
   * Улучшение карты: дубликаты этой карты + валюта.
   * Контракт: (playerId, cardId, duplicateCount)
   */
  upgradeCard(playerId, cardId, duplicateCount) {
    const playerCollection = this.playerCollections.get(playerId);

    if (!playerCollection) {
      return { success: false, error: 'collection_not_found' };
    }

    if (!playerCollection.cardDuplicates) {
      playerCollection.cardDuplicates = {};
    }
    if (!playerCollection.cardLevels) {
      playerCollection.cardLevels = {};
    }

    if (!playerCollection.cards.includes(cardId)) {
      return { success: false, error: 'card_not_owned' };
    }

    const allCards = require('./player_cards');
    const card = allCards.find((c) => c.id === cardId);
    if (!card || !UPGRADE_COSTS[card.rarity]) {
      return { success: false, error: 'unknown_rarity' };
    }

    const currentLevel = playerCollection.cardLevels[cardId] || 0;
    if (currentLevel >= MAX_CARD_LEVEL) {
      return { success: false, error: 'max_level' };
    }

    const nextLevel = currentLevel + 1;
    const cost = this.getUpgradeCost(card.rarity, nextLevel);
    const availableDuplicates = playerCollection.cardDuplicates[cardId] || 0;
    const offered = Number(duplicateCount) || 0;

    if (offered < cost.duplicates || availableDuplicates < cost.duplicates) {
      return { success: false, error: 'not_enough_duplicates' };
    }

    if (playerCollection.currency < cost.currency) {
      return { success: false, error: 'not_enough_currency' };
    }

    playerCollection.cardDuplicates[cardId] = availableDuplicates - cost.duplicates;
    playerCollection.duplicateCards = Math.max(
      0,
      (playerCollection.duplicateCards || 0) - cost.duplicates
    );
    playerCollection.currency -= cost.currency;
    playerCollection.cardLevels[cardId] = nextLevel;
    playerCollection.cardUpgrades++;
    playerCollection.lastUpdated = new Date().toISOString();

    return {
      success: true,
      upgradeLevel: nextLevel,
      duplicatesSpent: cost.duplicates,
      currencySpent: cost.currency,
      remainingDuplicates: playerCollection.cardDuplicates[cardId],
      remainingCurrency: playerCollection.currency,
      message: `Карта ${cardId} улучшена до уровня ${nextLevel}`
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