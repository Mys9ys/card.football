'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  createEnergyState,
  spendEnergy,
  applyRegen,
  grantMatchBonus,
  COST_OPEN_PACK,
  REGEN_MS,
} = require('./energy');

describe('energy', () => {
  it('spends 1 energy for a pack when available', () => {
    const start = createEnergyState(1_000_000);
    start.energy = 1;
    const result = spendEnergy(start, COST_OPEN_PACK, 1_000_000);
    assert.equal(result.success, true);
    assert.equal(result.state.energy, 0);
  });

  it('rejects spend when energy is empty', () => {
    const start = createEnergyState(1_000_000);
    start.energy = 0;
    const result = spendEnergy(start, COST_OPEN_PACK, 1_000_000);
    assert.equal(result.success, false);
    assert.equal(result.error, 'not_enough_energy');
    assert.equal(result.state.energy, 0);
  });

  it('regens +1 every 15 minutes up to max', () => {
    const start = createEnergyState(0);
    start.energy = 5;
    start.lastRegenAt = 0;
    const after = applyRegen(start, REGEN_MS * 2);
    assert.equal(after.energy, 7);
  });

  it('grants +1 match bonus without exceeding max', () => {
    const start = createEnergyState(0);
    start.energy = 10;
    const after = grantMatchBonus(start, 0);
    assert.equal(after.energy, 10);
  });
});
