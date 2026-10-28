'use strict';

// Action energy — docs/mechanics/energy.md

const ENERGY_MAX = 10;
const ENERGY_START = 10;
const COST_OPEN_PACK = 1;
const COST_MATCH = 2;
const REGEN_MS = 15 * 60 * 1000;
const MATCH_BONUS = 1;

function nowOr(nowMs) {
  return typeof nowMs === 'number' ? nowMs : Date.now();
}

function createEnergyState(nowMs) {
  const t = nowOr(nowMs);
  return {
    energy: ENERGY_START,
    max: ENERGY_MAX,
    lastRegenAt: t,
  };
}

function applyRegen(state, nowMs) {
  const t = nowOr(nowMs);
  const current = Math.min(state.max, Math.max(0, state.energy));
  if (current >= state.max) {
    return { ...state, energy: state.max, lastRegenAt: t };
  }

  const elapsed = Math.max(0, t - state.lastRegenAt);
  const ticks = Math.floor(elapsed / REGEN_MS);
  if (ticks <= 0) {
    return { ...state, energy: current };
  }

  const gained = Math.min(state.max - current, ticks);
  return {
    ...state,
    energy: current + gained,
    lastRegenAt: state.lastRegenAt + ticks * REGEN_MS,
  };
}

function canAfford(state, cost, nowMs) {
  const refreshed = applyRegen(state, nowMs);
  return refreshed.energy >= cost;
}

function spendEnergy(state, cost, nowMs) {
  const amount = Number(cost) || 0;
  if (amount < 0) {
    return { success: false, state, error: 'invalid_cost' };
  }

  const refreshed = applyRegen(state, nowMs);
  if (refreshed.energy < amount) {
    return {
      success: false,
      state: refreshed,
      error: 'not_enough_energy',
    };
  }

  return {
    success: true,
    state: {
      ...refreshed,
      energy: refreshed.energy - amount,
    },
  };
}

function grantMatchBonus(state, nowMs) {
  const refreshed = applyRegen(state, nowMs);
  return {
    ...refreshed,
    energy: Math.min(refreshed.max, refreshed.energy + MATCH_BONUS),
  };
}

function getEnergySnapshot(state, nowMs) {
  const t = nowOr(nowMs);
  const refreshed = applyRegen(state, t);
  let nextRegenInMs = 0;
  if (refreshed.energy < refreshed.max) {
    const since = t - refreshed.lastRegenAt;
    nextRegenInMs = Math.max(0, REGEN_MS - since);
  }
  return {
    energy: refreshed.energy,
    max: refreshed.max,
    nextRegenInMs,
  };
}

module.exports = {
  ENERGY_MAX,
  ENERGY_START,
  COST_OPEN_PACK,
  COST_MATCH,
  REGEN_MS,
  MATCH_BONUS,
  createEnergyState,
  applyRegen,
  canAfford,
  spendEnergy,
  grantMatchBonus,
  getEnergySnapshot,
};
