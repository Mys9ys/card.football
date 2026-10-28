// Определение типов карт для игры "Карточный футбол"

const CARD_TYPES = {
  // Типы игроков по амплуа
  PLAYER_POSITIONS: {
    ATTACKER: {
      id: 'attacker',
      name: 'Нападающий',
      abbreviation: 'АТ',
      description: 'Игроки, специализирующиеся на атаке и забивании голов'
    },
    MIDFIELDER: {
      id: 'midfielder',
      name: 'Полузащитник',
      abbreviation: 'ПЗ',
      description: 'Универсальные игроки, играющие как в атаке, так и в защите'
    },
    DEFENDER: {
      id: 'defender',
      name: 'Защитник',
      abbreviation: 'ЗЩ',
      description: 'Игроки, специализирующиеся на защите ворот'
    },
    GOALKEEPER: {
      id: 'goalkeeper',
      name: 'Вратарь',
      abbreviation: 'ВР',
      description: 'Последний рубеж обороны, защищающий ворота'
    }
  },

  // Карты атаки
  ATTACK_CARDS: {
    BREAKTHROUGH: {
      id: 'breakthrough',
      name: 'Прорыв',
      description: 'Игрок прорывается через оборону соперника',
      power: 7,
      speed: 6,
      technique: 5
    },
    ACCELERATION: {
      id: 'acceleration',
      name: 'Ускорение',
      description: 'Резкое увеличение скорости для обгона соперника',
      power: 4,
      speed: 8,
      technique: 6
    },
    DRIBBLING: {
      id: 'dribbling',
      name: 'Дриблинг',
      description: 'Умение обводить соперников один на один',
      power: 3,
      speed: 7,
      technique: 9
    },
    CROSS: {
      id: 'cross',
      name: 'Навес',
      description: 'Подача мяча с фланга в штрафную площадь',
      power: 6,
      speed: 5,
      technique: 7
    },
    LONG_SHOT: {
      id: 'long_shot',
      name: 'Дальний удар',
      description: 'Мощный удар по воротам издалека',
      power: 8,
      speed: 4,
      technique: 6
    }
  },

  // Карты защиты
  DEFENSE_CARDS: {
    TACKLE: {
      id: 'tackle',
      name: 'Подкат',
      description: 'Отбор мяча с помощью подката',
      power: 7,
      speed: 5,
      technique: 4
    },
    CLEARANCE: {
      id: 'clearance',
      name: 'Выбивание',
      description: 'Мощное выбивание мяча из опасной зоны',
      power: 8,
      speed: 4,
      technique: 5
    },
    MARKING: {
      id: 'marking',
      name: 'Плотное сопровождение',
      description: 'Постоянное прессингование соперника',
      power: 5,
      speed: 7,
      technique: 6
    },
    INTERCEPTION: {
      id: 'interception',
      name: 'Отбор',
      description: 'Перехват паса или движения соперника',
      power: 4,
      speed: 8,
      technique: 7
    },
    BLOCKING: {
      id: 'blocking',
      name: 'Блокирование',
      description: 'Преграждение пути сопернику или удару',
      power: 6,
      speed: 5,
      technique: 6
    }
  },

  // Тактические схемы (расстановки)
  FORMATIONS: {
    '4-4-2': {
      id: '4-4-2',
      name: '4-4-2',
      description: 'Классическая сбалансированная схема',
      players: {
        goalkeeper: 1,
        defenders: 4,
        midfielders: 4,
        attackers: 2
      }
    },
    '3-5-2': {
      id: '3-5-2',
      name: '3-5-2',
      description: 'Схема с усилением центра поля',
      players: {
        goalkeeper: 1,
        defenders: 3,
        midfielders: 5,
        attackers: 2
      }
    },
    '4-3-3': {
      id: '4-3-3',
      name: '4-3-3',
      description: 'Атакующая схема с тремя нападающими',
      players: {
        goalkeeper: 1,
        defenders: 4,
        midfielders: 3,
        attackers: 3
      }
    },
    '5-3-2': {
      id: '5-3-2',
      name: '5-3-2',
      description: 'Оборонительная схема с пятью защитниками',
      players: {
        goalkeeper: 1,
        defenders: 5,
        midfielders: 3,
        attackers: 2
      }
    },
    '4-2-3-1': {
      id: '4-2-3-1',
      name: '4-2-3-1',
      description: 'Современная гибкая схема',
      players: {
        goalkeeper: 1,
        defenders: 4,
        midfielders: 5, // 2 оборонительных + 3 атакующих
        attackers: 1
      }
    }
  },

  // Карты мотивации тренера (эффект — один розыгрыш, см. match-modifiers.md)
  COACH_CARDS: {
    SUPPORT: {
      id: 'support',
      name: 'Поддержка',
      description: 'Тренер подбадривает команду, повышая мораль',
      effect: 'increase_morale',
      duration: 'one_play',
      power: 5
    },
    REPRIMAND: {
      id: 'reprimand',
      name: 'Выговор',
      description: 'Тренер делает выговор игрокам, повышая концентрацию',
      effect: 'increase_concentration',
      duration: 'one_play',
      power: 6
    },
    INSPIRING_SPEECH: {
      id: 'inspiring_speech',
      name: 'Вдохновляющая речь',
      description: 'Тренер произносит вдохновляющую речь, заряжая команду',
      effect: 'boost_performance',
      duration: 'one_play',
      power: 8
    },
    TACTICAL_SUBSTITUTION: {
      id: 'tactical_substitution',
      name: 'Тактическая замена',
      description: 'Тренер делает стратегическую замену для изменения хода матча',
      effect: 'change_momentum',
      duration: 'one_play',
      power: 7
    }
  }
};

module.exports = CARD_TYPES;