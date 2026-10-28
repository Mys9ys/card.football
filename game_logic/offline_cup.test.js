'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  WINNER_PRIZE,
  startOfflineCup,
  runOfflineCup,
} = require('./offline_cup');
const { SQUAD_ERRORS } = require('./squad_rules');

function card(id, position, attack, defense) {
  return { id, position, attack, defense };
}

function squad442(prefix, atk, def) {
  return {
    goalkeeper: [card(`${prefix}-gk`, 'goalkeeper', 0, def)],
    defender: [
      card(`${prefix}-d1`, 'defender', 0, def),
      card(`${prefix}-d2`, 'defender', 0, def),
      card(`${prefix}-d3`, 'defender', 0, def),
      card(`${prefix}-d4`, 'defender', 0, def),
    ],
    midfielder: [
      card(`${prefix}-m1`, 'midfielder', atk, def),
      card(`${prefix}-m2`, 'midfielder', atk, def),
      card(`${prefix}-m3`, 'midfielder', atk, def),
      card(`${prefix}-m4`, 'midfielder', atk, def),
    ],
    attacker: [
      card(`${prefix}-a1`, 'attacker', atk, 0),
      card(`${prefix}-a2`, 'attacker', atk, 0),
    ],
  };
}

function entry(id, name, atk, def) {
  return {
    id,
    name,
    formation: '4-4-2',
    slots: squad442(id, atk, def),
  };
}

describe('offline_cup', () => {
  it('rejects cup that is not 8 teams', () => {
    const result = startOfflineCup([entry('a', 'A', 1, 1)]);
    assert.equal(result.success, false);
    assert.equal(result.error, 'cup_size');
  });

  it('rejects an entry that fails validateSquad', () => {
    const teams = [
      entry('t0', 'T0', 5, 5),
      entry('t1', 'T1', 5, 5),
      entry('t2', 'T2', 5, 5),
      entry('t3', 'T3', 5, 5),
      entry('t4', 'T4', 5, 5),
      entry('t5', 'T5', 5, 5),
      entry('t6', 'T6', 5, 5),
      entry('bad', 'Bad', 5, 5),
    ];
    teams[7].slots.goalkeeper = [];
    const result = startOfflineCup(teams);
    assert.equal(result.success, false);
    assert.equal(result.error, 'invalid_squad');
    assert.equal(result.teamId, 'bad');
    assert.equal(result.squadError, SQUAD_ERRORS.MISSING_GOALKEEPER);
  });

  it('strong team wins the final and gets the prize (QA scenario 1)', () => {
    const teams = [
      entry('strong', 'Strong', 40, 40),
      entry('w1', 'Weak1', 1, 1),
      entry('w2', 'Weak2', 1, 1),
      entry('w3', 'Weak3', 1, 1),
      entry('w4', 'Weak4', 1, 1),
      entry('w5', 'Weak5', 1, 1),
      entry('w6', 'Weak6', 1, 1),
      entry('w7', 'Weak7', 1, 1),
    ];
    const started = startOfflineCup(teams);
    assert.equal(started.success, true);

    const result = runOfflineCup(started.cup, { random: () => 0.5 });
    assert.equal(result.success, true);
    assert.equal(result.championId, 'strong');
    assert.equal(result.prize, WINNER_PRIZE);
    assert.equal(result.prize, 500);

    const final = result.matches.find((m) => m.round === 'final');
    assert.ok(final);
    assert.equal(final.winnerId, 'strong');
  });

  it('weak side loses in the first round (QA scenario 2)', () => {
    const teams = [
      entry('strong', 'Strong', 40, 40),
      entry('weak', 'Weak', 1, 1),
      entry('a', 'A', 8, 8),
      entry('b', 'B', 8, 8),
      entry('c', 'C', 8, 8),
      entry('d', 'D', 8, 8),
      entry('e', 'E', 8, 8),
      entry('f', 'F', 8, 8),
    ];
    const started = startOfflineCup(teams);
    const result = runOfflineCup(started.cup, { random: () => 0.5 });

    const qf = result.matches.filter((m) => m.round === 'quarterfinal');
    const weakWin = qf.some((m) => m.winnerId === 'weak');
    assert.equal(weakWin, false);
    assert.ok(qf.some((m) => m.homeId === 'weak' || m.awayId === 'weak'));
  });
});
