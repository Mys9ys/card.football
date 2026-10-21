'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { validateSquad, SQUAD_ERRORS } = require('./squad_rules');

function card(id, position) {
  return { id, position };
}

function squad442(ids) {
  const [gk, d1, d2, d3, d4, m1, m2, m3, m4, a1, a2] = ids;
  return {
    goalkeeper: [card(gk, 'goalkeeper')],
    defender: [
      card(d1, 'defender'),
      card(d2, 'defender'),
      card(d3, 'defender'),
      card(d4, 'defender')
    ],
    midfielder: [
      card(m1, 'midfielder'),
      card(m2, 'midfielder'),
      card(m3, 'midfielder'),
      card(m4, 'midfielder')
    ],
    attacker: [card(a1, 'attacker'), card(a2, 'attacker')]
  };
}

describe('validateSquad', () => {
  it('accepts a valid 4-4-2 squad', () => {
    const slots = squad442([
      'gk1', 'd1', 'd2', 'd3', 'd4', 'm1', 'm2', 'm3', 'm4', 'a1', 'a2'
    ]);
    assert.deepEqual(validateSquad('4-4-2', slots), { success: true });
  });

  it('rejects empty goalkeeper line for 4-4-2 (QA scenario 1)', () => {
    const slots = squad442([
      'gk1', 'd1', 'd2', 'd3', 'd4', 'm1', 'm2', 'm3', 'm4', 'a1', 'a2'
    ]);
    slots.goalkeeper = [];
    const result = validateSquad('4-4-2', slots);
    assert.equal(result.success, false);
    assert.equal(result.error, SQUAD_ERRORS.MISSING_GOALKEEPER);
  });

  it('rejects 4-4-2 slot fill when formation is 4-3-3 (QA scenario 2)', () => {
    const slots = squad442([
      'gk1', 'd1', 'd2', 'd3', 'd4', 'm1', 'm2', 'm3', 'm4', 'a1', 'a2'
    ]);
    const result = validateSquad('4-3-3', slots);
    assert.equal(result.success, false);
    assert.equal(result.error, SQUAD_ERRORS.SLOT_COUNT);
  });

  it('rejects duplicate card id on defenders (QA scenario 3)', () => {
    const slots = squad442([
      'gk1', 'd1', 'd1', 'd3', 'd4', 'm1', 'm2', 'm3', 'm4', 'a1', 'a2'
    ]);
    const result = validateSquad('4-4-2', slots);
    assert.equal(result.success, false);
    assert.equal(result.error, SQUAD_ERRORS.DUPLICATE_CARD);
  });
});
