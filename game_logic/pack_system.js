// Система пакетов для игры "Карточный футбол"

class PackSystem {
  constructor() {
    this.packTypes = {
      // Стандартный пакет
      standard: {
        id: 'standard',
        name: 'Стандартный пакет',
        price: 100, // в игровой валюте
        cardsCount: 5,
        rarityWeights: {
          common: 70,
          rare: 20,
          epic: 8,
          legendary: 2
        },
        description: 'Основной пакет с разнообразными картами'
      },
      // Премиум пакет
      premium: {
        id: 'premium',
        name: 'Премиум пакет',
        price: 500, // в игровой валюте
        cardsCount: 5,
        rarityWeights: {
          common: 50,
          rare: 30,
          epic: 15,
          legendary: 5
        },
        guaranteedEpic: true,
        description: 'Повышенные шансы на редкие и эпические карты'
      },
      // Легендарный пакет
      legendary: {
        id: 'legendary',
        name: 'Легендарный пакет',
        price: 2000, // в игровой валюте
        cardsCount: 5,
        rarityWeights: {
          common: 30,
          rare: 30,
          epic: 25,
          legendary: 15
        },
        guaranteedLegendary: true,
        guaranteedEpic: true,
        description: 'Высокие шансы на легендарные карты'
      },
      // Тематический пакет (например, "Золотые легенды")
      golden_legends: {
        id: 'golden_legends',
        name: 'Золотые легенды',
        price: 1500, // в игровой валюте
        cardsCount: 5,
        rarityWeights: {
          common: 0,
          rare: 20,
          epic: 40,
          legendary: 40
        },
        onlyAttackers: true,
        guaranteedLegendary: true,
        description: 'Только нападающие высокой редкости'
      },
      // Пакет защиты
      defense_pack: {
        id: 'defense_pack',
        name: 'Пакет защиты',
        price: 800, // в игровой валюте
        cardsCount: 5,
        rarityWeights: {
          common: 10,
          rare: 30,
          epic: 40,
          legendary: 20
        },
        onlyDefense: true,
        guaranteedEpic: true,
        description: 'Специализированный пакет с картами защиты и защитниками'
      },
      // Новичковый пакет
      starter: {
        id: 'starter',
        name: 'Стартовый пакет',
        price: 0, // бесплатный
        cardsCount: 10,
        rarityWeights: {
          common: 90,
          rare: 10,
          epic: 0,
          legendary: 0
        },
        guaranteedRare: true,
        description: 'Бесплатный пакет для новичков'
      }
    };
  }

  /**
   * Получение информации о типе пакета
   */
  getPackType(packTypeId) {
    return this.packTypes[packTypeId];
  }

  /**
   * Получение всех доступных типов пакетов
   */
  getAllPackTypes() {
    return Object.values(this.packTypes);
  }

  /**
   * Генерация случайного числа в диапазоне
   */
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Выбор редкости карты на основе весов
   */
  selectRarity(rarityWeights) {
    const totalWeight = Object.values(rarityWeights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      random -= weight;
      if (random <= 0) {
        return rarity;
      }
    }
    
    return 'common'; // fallback
  }

  /**
   * Открытие пакета
   */
  openPack(packTypeId, allCards) {
    const packType = this.packTypes[packTypeId];
    
    if (!packType) {
      return {
        success: false,
        error: `Тип пакета ${packTypeId} не найден`
      };
    }

    const cards = [];
    const usedCardIds = new Set();
    
    // Фильтрация карт по типу пакета
    let availableCards = allCards;
    
    if (packType.onlyAttackers) {
      availableCards = allCards.filter(card => card.position === 'attacker');
    } else if (packType.onlyDefense) {
      availableCards = allCards.filter(card => 
        card.position === 'defender' || 
        card.position === 'goalkeeper' ||
        (card.abilities && card.abilities.some(ability => 
          ['tackle', 'clearance', 'marking', 'interception', 'blocking'].includes(ability)
        ))
      );
    }

    // Гарантированные карты
    if (packType.guaranteedLegendary) {
      const legendaryCards = availableCards.filter(card => card.rarity === 'legendary');
      if (legendaryCards.length > 0) {
        const randomIndex = this.getRandomInt(0, legendaryCards.length - 1);
        cards.push(legendaryCards[randomIndex]);
        usedCardIds.add(legendaryCards[randomIndex].id);
      }
    }
    
    if (packType.guaranteedEpic && cards.length < packType.cardsCount) {
      const epicCards = availableCards.filter(card => 
        card.rarity === 'epic' && !usedCardIds.has(card.id)
      );
      if (epicCards.length > 0) {
        const randomIndex = this.getRandomInt(0, epicCards.length - 1);
        cards.push(epicCards[randomIndex]);
        usedCardIds.add(epicCards[randomIndex].id);
      }
    }
    
    if (packType.guaranteedRare && cards.length < packType.cardsCount) {
      const rareCards = availableCards.filter(card => 
        card.rarity === 'rare' && !usedCardIds.has(card.id)
      );
      if (rareCards.length > 0) {
        const randomIndex = this.getRandomInt(0, rareCards.length - 1);
        cards.push(rareCards[randomIndex]);
        usedCardIds.add(rareCards[randomIndex].id);
      }
    }

    // Генерация остальных карт
    while (cards.length < packType.cardsCount) {
      // Выбираем редкость
      const rarity = this.selectRarity(packType.rarityWeights);
      
      // Фильтруем карты по редкости и уже использованным ID
      const rarityCards = availableCards.filter(card => 
        card.rarity === rarity && !usedCardIds.has(card.id)
      );
      
      // Если нет доступных карт этой редкости, пробуем другую
      if (rarityCards.length === 0) {
        continue;
      }
      
      // Выбираем случайную карту
      const randomIndex = this.getRandomInt(0, rarityCards.length - 1);
      cards.push(rarityCards[randomIndex]);
      usedCardIds.add(rarityCards[randomIndex].id);
    }

    return {
      success: true,
      packType: packTypeId,
      cards: cards,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Получение цены пакета
   */
  getPackPrice(packTypeId) {
    const packType = this.packTypes[packTypeId];
    return packType ? packType.price : null;
  }
}

module.exports = PackSystem;