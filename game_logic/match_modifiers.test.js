'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const MatchEngine = require('./match_engine');
const {
  FORMATION_MODIFIERS,
  getFormationModifier,
  getMotivationModifier,
  applyPlayModifiers,
} = require('./match_modifiers');

function player(position, attack, defense) {
  return { position, attack, defense };
}

function team(id, name, formation, players) {
  return { id, name, formation, players };
}

const sameLineup = [
  player('attacker', 10, 0),
  player('midfielder', 5, 5),
  player('defender', 0, 10),
];

describe('match_modifiers', () => {
  it('defines a numeric modifier for every GAME_CONCEPT formation', () => {
    const ids = ['4-4-2', '3-5-2', '4-3-3', '5-3-2', '4-2-3-1'];
    for (const id of ids) {
      const mod = getFormationModifier(id);
      assert.equal(typeof mod.attack, 'number');
      assert.equal(typeof mod.defense, 'number');
      assert.deepEqual(mod, FORMATION_MODIFIERS[id]);
    }
  });

  it('returns zeros for unknown formation', () => {
    assert.deepEqual(getFormationModifier('9-9-9'), { attack: 0, defense: 0 });
    assert.deepEqual(getFormationModifier(undefined), { attack: 0, defense: 0 });
  });

  it('applies one-play motivation without changing half budgets (API contract)', () => {
    assert.deepEqual(getMotivationModifier('support', 'attacking'), { attack: 3, defense: 3 });
    assert.deepEqual(getMotivationModifier('reprimand', 'defending'), { attack: 0, defense: 4 });
    assert.deepEqual(getMotivationModifier('inspiring_speech', 'attacking'), { attack: 5, defense: 0 });
    assert.deepEqual(getMotivationModifier('inspiring_speech', 'defending'), { attack: 0, defense: 5 });
    assert.deepEqual(getMotivationModifier('tactical_substitution', 'attacking'), { attack: 4, defense: 0 });
    assert.deepEqual(getMotivationModifier('tactical_substitution', 'defending'), { attack: 0, defense: 4 });
  });

  it('sums formation and motivation in applyPlayModifiers', () => {
    const play = applyPlayModifiers({
      formationId: '4-3-3',
      motivationId: 'inspiring_speech',
      role: 'attacking',
    });
    assert.equal(play.attack, 4 + 5);
    assert.equal(play.defense, -2 + 0);
  });
});

describe('MatchEngine + formations', () => {
  let originalRandom;

  beforeEach(() => {
    originalRandom = Math.random;
    Math.random = () => 0.5;
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it('same cards, different formations → different attack modifier in result', () => {
    const engineA = new MatchEngine();
    engineA.initializeMatch(
      team('home', 'Home', '4-3-3', sameLineup),
      team('away', 'Away', '4-4-2', sameLineup)
    );
    const with433 = engineA.executeAttack('home', 'away', [], []);

    const engineB = new MatchEngine();
    engineB.initializeMatch(
      team('home', 'Home', '5-3-2', sameLineup),
      team('away', 'Away', '4-4-2', sameLineup)
    );
    const with532 = engineB.executeAttack('home', 'away', [], []);

    assert.notEqual(
      with433.modifiers.attack.formation.attack,
      with532.modifiers.attack.formation.attack
    );
    assert.equal(with433.attackPower - with532.attackPower, 4 - (-2));
  });

  it('inspiring_speech boosts one play and still spends one attack', () => {
    const engine = new MatchEngine();
    engine.initializeMatch(
      team('home', 'Home', '4-4-2', sameLineup),
      team('away', 'Away', '4-4-2', sameLineup)
    );

    const before = engine.getMatchState().teams.home.attacksLeft;
    const result = engine.executeAttack('home', 'away', [], [], {
      attackMotivation: 'inspiring_speech',
    });

    assert.equal(result.success, true);
    assert.equal(result.modifiers.attack.motivation.attack, 5);
    assert.equal(result.modifiers.attack.motivation.defense, 0);
    assert.equal(result.attacksLeft, before - 1);
  });

  it('reprimand raises defensePower by 4 vs same play without it', () => {
    const base = new MatchEngine();
    base.initializeMatch(
      team('home', 'Home', '4-4-2', sameLineup),
      team('away', 'Away', '4-4-2', sameLineup)
    );
    const without = base.executeAttack('home', 'away', [], []);

    const boosted = new MatchEngine();
    boosted.initializeMatch(
      team('home', 'Home', '4-4-2', sameLineup),
      team('away', 'Away', '4-4-2', sameLineup)
    );
    const withRep = boosted.executeAttack('home', 'away', [], [], {
      defenseMotivation: 'reprimand',
    });

    assert.equal(withRep.defensePower - without.defensePower, 4);
  });
});
