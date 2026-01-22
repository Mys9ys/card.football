// Движок матча для игры "Карточный футбол"

class MatchEngine {
  constructor() {
    this.teams = {};
    this.currentPossession = null;
    this.matchState = 'not_started'; // not_started, first_half, second_half, finished
    this.half = 1;
    this.matchTime = 0;
    this.maxMatchTime = 90; // минуты
    this.attacksPerHalf = 5;
    this.events = [];
  }

  /**
   * Инициализация матча между двумя командами
   */
  initializeMatch(team1, team2) {
    this.teams[team1.id] = {
      ...team1,
      attacksLeft: this.attacksPerHalf,
      defensesLeft: this.attacksPerHalf
    };
    this.teams[team2.id] = {
      ...team2,
      attacksLeft: this.attacksPerHalf,
      defensesLeft: this.attacksPerHalf
    };

    // Определяем, какая команда начинает с атаки
    this.currentPossession = Math.random() > 0.5 ? team1.id : team2.id;
    this.matchState = 'first_half';
    this.matchTime = 0;

    this.events.push({
      time: 0,
      type: 'match_start',
      description: `Матч начинается! ${this.currentPossession === team1.id ? team1.name : team2.name} начинает с атаки.`
    });

    return {
      success: true,
      startingTeam: this.currentPossession,
      message: `Матч начат. ${this.currentPossession === team1.id ? team1.name : team2.name} начинает с атаки.`
    };
  }

  /**
   * Выполнение атаки одной команды против защиты другой
   */
  executeAttack(attackingTeamId, defendingTeamId, attackCards, defenseCards) {
    // Проверяем состояние матча
    if (this.matchState !== 'first_half' && this.matchState !== 'second_half') {
      return {
        success: false,
        error: 'Матч не идет или уже завершен'
      };
    }

    const attackingTeam = this.teams[attackingTeamId];
    const defendingTeam = this.teams[defendingTeamId];

    // Проверяем, есть ли еще атаки у атакующей команды
    if (attackingTeam.attacksLeft <= 0) {
      return {
        success: false,
        error: 'У команды закончились атаки в этом тайме'
      };
    }

    // Проверяем, есть ли еще оборонительные действия у обороняющейся команды
    if (defendingTeam.defensesLeft <= 0) {
      return {
        success: false,
        error: 'У команды закончились защитные действия в этом тайме'
      };
    }

    // Рассчитываем силу атаки
    const attackPower = this.calculateAttackPower(attackingTeam, attackCards);
    // Рассчитываем силу защиты
    const defensePower = this.calculateDefensePower(defendingTeam, defenseCards);

    // Определяем результат взаимодействия
    const result = this.resolveAttack(attackPower, defensePower, attackingTeam, defendingTeam);

    // Обновляем количество оставшихся действий
    attackingTeam.attacksLeft--;
    defendingTeam.defensesLeft--;

    // Увеличиваем время матча
    this.matchTime += 10; // Каждая атака занимает примерно 10 минут

    // Проверяем, нужно ли менять тайм
    if (this.half === 1 && this.matchTime >= 45) {
      this.half = 2;
      this.matchTime = 45;
      // Восстанавливаем количество действий для второго тайма
      Object.values(this.teams).forEach(team => {
        team.attacksLeft = this.attacksPerHalf;
        team.defensesLeft = this.attacksPerHalf;
      });
      
      this.events.push({
        time: 45,
        type: 'half_time',
        description: 'Перерыв! Команды возвращаются на вторую половину матча с полным запасом действий.'
      });
    }

    // Фиксируем событие
    this.events.push({
      time: this.matchTime,
      type: 'attack',
      attackingTeam: attackingTeam.name,
      defendingTeam: defendingTeam.name,
      attackPower,
      defensePower,
      result
    });

    return {
      success: true,
      ...result,
      matchTime: this.matchTime,
      attacksLeft: attackingTeam.attacksLeft,
      defensesLeft: defendingTeam.defensesLeft
    };
  }

  /**
   * Рассчет силы атаки
   */
  calculateAttackPower(team, attackCards) {
    // Базовая сила атаки команды
    let baseAttackPower = team.players
      .filter(player => ['attacker', 'midfielder'].includes(player.position))
      .reduce((sum, player) => sum + player.attack, 0);

    // Модификаторы от карт атаки
    const attackModifiers = attackCards.reduce((modifiers, card) => {
      return {
        power: modifiers.power + (card.power || 0),
        speed: modifiers.speed + (card.speed || 0),
        technique: modifiers.technique + (card.technique || 0)
      };
    }, { power: 0, speed: 0, technique: 0 });

    // Итоговая сила атаки
    const totalAttackPower = baseAttackPower + 
      attackModifiers.power * 0.3 + 
      attackModifiers.speed * 0.4 + 
      attackModifiers.technique * 0.3;

    return Math.round(totalAttackPower);
  }

  /**
   * Рассчет силы защиты
   */
  calculateDefensePower(team, defenseCards) {
    // Базовая сила защиты команды
    let baseDefensePower = team.players
      .filter(player => ['defender', 'midfielder', 'goalkeeper'].includes(player.position))
      .reduce((sum, player) => sum + player.defense, 0);

    // Модификаторы от карт защиты
    const defenseModifiers = defenseCards.reduce((modifiers, card) => {
      return {
        power: modifiers.power + (card.power || 0),
        speed: modifiers.speed + (card.speed || 0),
        technique: modifiers.technique + (card.technique || 0)
      };
    }, { power: 0, speed: 0, technique: 0 });

    // Итоговая сила защиты
    const totalDefensePower = baseDefensePower + 
      defenseModifiers.power * 0.4 + 
      defenseModifiers.speed * 0.3 + 
      defenseModifiers.technique * 0.3;

    return Math.round(totalDefensePower);
  }

  /**
   * Определение результата взаимодействия атаки и защиты
   */
  resolveAttack(attackPower, defensePower, attackingTeam, defendingTeam) {
    const powerDifference = attackPower - defensePower;
    
    // Генерируем случайный фактор для имитации непредсказуемости футбола
    const randomFactor = (Math.random() * 20) - 10; // от -10 до +10
    const adjustedDifference = powerDifference + randomFactor;

    let result = {};

    if (adjustedDifference > 15) {
      // Очень сильная атака - гол
      result.outcome = 'goal';
      result.score = 1;
      result.description = `${attackingTeam.name} забивает потрясающий гол! Атака была слишком сильной для обороны ${defendingTeam.name}.`;
    } else if (adjustedDifference > 5) {
      // Сильная атака - опасный момент
      result.outcome = 'dangerous_attack';
      result.score = 0;
      result.description = `${attackingTeam.name} создает опасный момент! Вратарь ${defendingTeam.name} чудом отбивает мяч.`;
    } else if (adjustedDifference > -5) {
      // Сбалансированная игра - владение мячом
      result.outcome = 'possession';
      result.score = 0;
      result.description = `Интересная борьба! Атака ${attackingTeam.name} встречает достойное сопротивление от обороны ${defendingTeam.name}. Мяч остается в игре.`;
    } else if (adjustedDifference > -15) {
      // Сильная защита - отбитие
      result.outcome = 'defense_success';
      result.score = 0;
      result.description = `Отличная работа обороны ${defendingTeam.name}! Они успешно нейтрализуют атаку ${attackingTeam.name}.`;
    } else {
      // Очень сильная защита - контратака
      result.outcome = 'counter_attack';
      result.score = 0;
      result.description = `Оборона ${defendingTeam.name} не только отбивает атаку, но и мгновенно переходит в контратаку! Опасность для ${attackingTeam.name}.`;
    }

    // Добавляем детали
    result.attackPower = attackPower;
    result.defensePower = defensePower;
    result.powerDifference = powerDifference;
    result.randomFactor = randomFactor;
    result.adjustedDifference = adjustedDifference;

    return result;
  }

  /**
   * Завершение матча
   */
  finishMatch() {
    this.matchState = 'finished';
    
    // Подсчет общего счета
    const totalGoals = this.events.filter(event => event.type === 'attack' && event.result.outcome === 'goal')
      .reduce((score, event) => {
        const attackingTeamId = Object.keys(this.teams).find(id => this.teams[id].name === event.attackingTeam);
        score[attackingTeamId] = (score[attackingTeamId] || 0) + 1;
        return score;
      }, {});

    this.events.push({
      time: this.matchTime,
      type: 'match_end',
      description: `Матч завершен! Финальный свисток!`,
      finalScore: totalGoals
    });

    return {
      success: true,
      finalScore: totalGoals,
      events: this.events
    };
  }

  /**
   * Получение текущего состояния матча
   */
  getMatchState() {
    return {
      matchState: this.matchState,
      half: this.half,
      matchTime: this.matchTime,
      teams: Object.keys(this.teams).reduce((obj, teamId) => {
        obj[teamId] = {
          name: this.teams[teamId].name,
          attacksLeft: this.teams[teamId].attacksLeft,
          defensesLeft: this.teams[teamId].defensesLeft
        };
        return obj;
      }, {}),
      currentPossession: this.currentPossession,
      events: this.events.slice(-5) // Последние 5 событий
    };
  }
}

module.exports = MatchEngine;