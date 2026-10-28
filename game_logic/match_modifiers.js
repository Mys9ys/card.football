'use strict';

// Formation + coach motivation — docs/mechanics/match-modifiers.md

const FORMATION_MODIFIERS = {
  '4-4-2': { attack: 0, defense: 0 },
  '3-5-2': { attack: 2, defense: 1 },
  '4-3-3': { attack: 4, defense: -2 },
  '5-3-2': { attack: -2, defense: 4 },
  '4-2-3-1': { attack: 2, defense: 2 },
};

const ZERO = Object.freeze({ attack: 0, defense: 0 });

function getFormationModifier(formationId) {
  if (!formationId || !FORMATION_MODIFIERS[formationId]) {
    return { ...ZERO };
  }
  return { ...FORMATION_MODIFIERS[formationId] };
}

/**
 * @param {string|null|undefined} cardId
 * @param {'attacking'|'defending'} role
 */
function getMotivationModifier(cardId, role) {
  if (!cardId) {
    return { ...ZERO };
  }

  switch (cardId) {
    case 'support':
      return { attack: 3, defense: 3 };
    case 'reprimand':
      return { attack: 0, defense: 4 };
    case 'inspiring_speech':
      return role === 'attacking'
        ? { attack: 5, defense: 0 }
        : { attack: 0, defense: 5 };
    case 'tactical_substitution':
      return role === 'attacking'
        ? { attack: 4, defense: 0 }
        : { attack: 0, defense: 4 };
    default:
      return { ...ZERO };
  }
}

/**
 * @param {{ formationId?: string, motivationId?: string, role: 'attacking'|'defending' }} input
 */
function applyPlayModifiers({ formationId, motivationId, role }) {
  const formation = getFormationModifier(formationId);
  const motivation = getMotivationModifier(motivationId, role);
  return {
    formation,
    motivation,
    attack: formation.attack + motivation.attack,
    defense: formation.defense + motivation.defense,
  };
}

module.exports = {
  FORMATION_MODIFIERS,
  getFormationModifier,
  getMotivationModifier,
  applyPlayModifiers,
};
