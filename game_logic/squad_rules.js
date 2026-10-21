// Проверка состава перед сохранением и матчем.
// Слоты берутся из CARD_TYPES.FORMATIONS. Химия и карты тренера здесь не учитываются.

const CARD_TYPES = require('./card_types');

const SQUAD_ERRORS = Object.freeze({
  UNKNOWN_FORMATION: 'unknown_formation',
  INVALID_SQUAD: 'invalid_squad',
  MISSING_GOALKEEPER: 'missing_goalkeeper',
  SLOT_COUNT: 'slot_count',
  EMPTY_SLOT: 'empty_slot',
  INVALID_CARD: 'invalid_card',
  POSITION_MISMATCH: 'position_mismatch',
  DUPLICATE_CARD: 'duplicate_card'
});

const LINES = [
  { position: 'goalkeeper', countKey: 'goalkeeper' },
  { position: 'defender', countKey: 'defenders' },
  { position: 'midfielder', countKey: 'midfielders' },
  { position: 'attacker', countKey: 'attackers' }
];

function reject(error) {
  return { success: false, error };
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Состав годится для сохранения и матча только при success: true.
 * slots: { goalkeeper: Card[], defender: Card[], midfielder: Card[], attacker: Card[] }
 * Card: { id: string, position: string }
 */
function validateSquad(formationId, slots) {
  const formation = CARD_TYPES.FORMATIONS[formationId];
  if (!formation || !formation.players) {
    return reject(SQUAD_ERRORS.UNKNOWN_FORMATION);
  }

  if (!isPlainObject(slots)) {
    return reject(SQUAD_ERRORS.INVALID_SQUAD);
  }

  const ids = [];

  for (const line of LINES) {
    const expected = formation.players[line.countKey];
    const hasLine = Object.prototype.hasOwnProperty.call(slots, line.position);
    const lineSlots = hasLine ? slots[line.position] : undefined;

    if (lineSlots == null) {
      return reject(line.position === 'goalkeeper'
        ? SQUAD_ERRORS.MISSING_GOALKEEPER
        : SQUAD_ERRORS.SLOT_COUNT);
    }

    if (!Array.isArray(lineSlots)) {
      return reject(SQUAD_ERRORS.INVALID_SQUAD);
    }

    if (line.position === 'goalkeeper' && lineSlots.length === 0) {
      return reject(SQUAD_ERRORS.MISSING_GOALKEEPER);
    }

    if (lineSlots.length !== expected) {
      return reject(SQUAD_ERRORS.SLOT_COUNT);
    }

    for (const card of lineSlots) {
      if (card == null) {
        return reject(line.position === 'goalkeeper'
          ? SQUAD_ERRORS.MISSING_GOALKEEPER
          : SQUAD_ERRORS.EMPTY_SLOT);
      }

      if (!isPlainObject(card) || typeof card.id !== 'string' || card.id.length === 0) {
        return reject(SQUAD_ERRORS.INVALID_CARD);
      }

      if (card.position !== line.position) {
        return reject(SQUAD_ERRORS.POSITION_MISMATCH);
      }

      ids.push(card.id);
    }
  }

  const seenIds = new Set();
  for (const id of ids) {
    if (seenIds.has(id)) {
      return reject(SQUAD_ERRORS.DUPLICATE_CARD);
    }
    seenIds.add(id);
  }

  return { success: true };
}

module.exports = {
  validateSquad,
  SQUAD_ERRORS
};
