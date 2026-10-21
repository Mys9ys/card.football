'use strict';

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const MatchEngine = require('./match_engine');
const { ATTACK_CARDS, DEFENSE_CARDS } = require('./card_types');

function player(position, attack, defense) {
  return { position, attack, defense };
}

function team(id, name, players) {
  return { id, name, players };
}

function startedMatch() {
  const engine = new MatchEngine();
  engine.initializeMatch(
    team('home', 'Home', [player('attacker', 10, 0)]),
    team('away', 'Away', [player('defender', 0, 10)])
  );
  return engine;
}

function play(engine, attackerId) {
  const defenderId = attackerId === 'home' ? 'away' : 'home';
  return engine.executeAttack(attackerId, defenderId, [], []);
}

describe('MatchEngine', () => {
  let originalRandom;

  beforeEach(() => {
    originalRandom = Math.random;
    // randomFactor = 0.5 * 20 - 10 = 0, so outcome follows the raw power gap.
    Math.random = () => 0.5;
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  describe('initializeMatch', () => {
    it('gives each team 5 attacks and 5 defenses and starts the first half', () => {
      const engine = new MatchEngine();
      const home = team('home', 'Home', []);
      const away = team('away', 'Away', []);

      const started = engine.initializeMatch(home, away);

      assert.equal(started.success, true);
      assert.equal(started.startingTeam, 'away');
      const state = engine.getMatchState();
      assert.equal(state.matchState, 'first_half');
      assert.equal(state.half, 1);
      assert.equal(state.teams.home.attacksLeft, 5);
      assert.equal(state.teams.home.defensesLeft, 5);
      assert.equal(state.teams.away.attacksLeft, 5);
      assert.equal(state.teams.away.defensesLeft, 5);
    });
  });

  describe('resolveAttack outcomes', () => {
    const bands = [
      { gap: 16, outcome: 'goal', score: 1 },
      { gap: 15, outcome: 'dangerous_attack', score: 0 },
      { gap: 6, outcome: 'dangerous_attack', score: 0 },
      { gap: 5, outcome: 'possession', score: 0 },
      { gap: 0, outcome: 'possession', score: 0 },
      { gap: -5, outcome: 'defense_success', score: 0 },
      { gap: -6, outcome: 'defense_success', score: 0 },
      { gap: -15, outcome: 'counter_attack', score: 0 },
      { gap: -16, outcome: 'counter_attack', score: 0 }
    ];

    for (const { gap, outcome, score } of bands) {
      it(`maps power gap ${gap} to ${outcome}`, () => {
        const engine = new MatchEngine();
        const result = engine.resolveAttack(
          100,
          100 - gap,
          { name: 'Home' },
          { name: 'Away' }
        );

        assert.equal(result.outcome, outcome);
        assert.equal(result.score, score);
        assert.equal(result.powerDifference, gap);
        assert.equal(result.randomFactor, 0);
        assert.equal(result.adjustedDifference, gap);
      });
    }
  });

  describe('attack and defense matching', () => {
    it('scores when the attack set is clearly stronger than the defense set', () => {
      const engine = new MatchEngine();
      const home = team('home', 'Home', [
        player('attacker', 60, 0),
        player('midfielder', 40, 0)
      ]);
      const away = team('away', 'Away', [
        player('defender', 0, 30),
        player('goalkeeper', 0, 20)
      ]);
      engine.initializeMatch(home, away);

      const result = engine.executeAttack('home', 'away', [], []);

      assert.equal(result.success, true);
      assert.equal(result.attackPower, 100);
      assert.equal(result.defensePower, 50);
      assert.equal(result.outcome, 'goal');
      assert.equal(result.score, 1);
      assert.equal(engine.getMatchState().teams.home.attacksLeft, 4);
      assert.equal(engine.getMatchState().teams.home.defensesLeft, 5);
      assert.equal(engine.getMatchState().teams.away.attacksLeft, 5);
      assert.equal(engine.getMatchState().teams.away.defensesLeft, 4);
    });

    it('keeps possession when attack and defense powers are level', () => {
      const engine = new MatchEngine();
      const home = team('home', 'Home', [player('attacker', 40, 0)]);
      const away = team('away', 'Away', [player('defender', 0, 40)]);
      engine.initializeMatch(home, away);

      const result = engine.executeAttack('home', 'away', [], []);

      assert.equal(result.attackPower, 40);
      assert.equal(result.defensePower, 40);
      assert.equal(result.outcome, 'possession');
      assert.equal(result.score, 0);
    });

    it('flips the same attack into a counter when the defense set is much stronger', () => {
      const engine = new MatchEngine();
      const home = team('home', 'Home', [player('attacker', 40, 0)]);
      const away = team('away', 'Away', [
        player('defender', 0, 40),
        player('goalkeeper', 0, 30)
      ]);
      engine.initializeMatch(home, away);

      const result = engine.executeAttack('home', 'away', [], []);

      assert.equal(result.attackPower, 40);
      assert.equal(result.defensePower, 70);
      assert.equal(result.outcome, 'counter_attack');
      assert.equal(result.score, 0);
    });

    it('applies attack-card and defense-card weights from the concept card stats', () => {
      const engine = new MatchEngine();
      const home = team('home', 'Home', [
        player('attacker', 25, 0),
        player('midfielder', 15, 10)
      ]);
      const away = team('away', 'Away', [
        player('defender', 0, 20),
        player('midfielder', 0, 10),
        player('goalkeeper', 0, 10)
      ]);
      engine.initializeMatch(home, away);

      const longShot = ATTACK_CARDS.LONG_SHOT;
      const tackle = DEFENSE_CARDS.TACKLE;
      const attackPower = engine.calculateAttackPower(home, [longShot]);
      const defensePower = engine.calculateDefensePower(away, [tackle]);

      // Attack: base 40 + round(8*0.3 + 4*0.4 + 6*0.3) = 40 + 6 = 46
      // Defense: base 40 + round(7*0.4 + 5*0.3 + 4*0.3) = 40 + 6 = 46
      assert.equal(attackPower, 46);
      assert.equal(defensePower, 46);

      const result = engine.executeAttack('home', 'away', [longShot], [tackle]);
      assert.equal(result.attackPower, 46);
      assert.equal(result.defensePower, 46);
      assert.equal(result.outcome, 'possession');
    });

    it('weights a power-only card higher on defense than on attack', () => {
      const engine = new MatchEngine();
      const squad = team('side', 'Side', [
        player('attacker', 0, 0),
        player('midfielder', 0, 0),
        player('defender', 0, 0),
        player('goalkeeper', 0, 0)
      ]);
      const card = [{ power: 10, speed: 0, technique: 0 }];

      assert.equal(engine.calculateAttackPower(squad, card), 3);
      assert.equal(engine.calculateDefensePower(squad, card), 4);
    });

    it('counts attackers and midfielders for attack, and defense line plus midfielders for defense', () => {
      const engine = new MatchEngine();
      const squad = team('side', 'Side', [
        player('attacker', 11, 99),
        player('midfielder', 12, 18),
        player('defender', 99, 7),
        player('goalkeeper', 99, 8)
      ]);

      assert.equal(engine.calculateAttackPower(squad, []), 23);
      assert.equal(engine.calculateDefensePower(squad, []), 33);
    });
  });

  describe('action limits', () => {
    it('rejects an attack when the match has not started', () => {
      const engine = new MatchEngine();
      const result = engine.executeAttack('home', 'away', [], []);

      assert.equal(result.success, false);
      assert.equal(result.error, 'Матч не идет или уже завершен');
    });

    it('rejects an attack after the match is finished', () => {
      const engine = new MatchEngine();
      engine.initializeMatch(team('home', 'Home', []), team('away', 'Away', []));
      engine.finishMatch();

      const result = engine.executeAttack('home', 'away', [], []);

      assert.equal(result.success, false);
      assert.equal(result.error, 'Матч не идет или уже завершен');
    });

    it('rejects an attack when the attacking team has no attacks left', () => {
      const engine = new MatchEngine();
      engine.initializeMatch(
        team('home', 'Home', [player('attacker', 10, 0)]),
        team('away', 'Away', [player('defender', 0, 10)])
      );
      engine.teams.home.attacksLeft = 0;

      const result = engine.executeAttack('home', 'away', [], []);

      assert.equal(result.success, false);
      assert.equal(result.error, 'У команды закончились атаки в этом тайме');
      assert.equal(engine.teams.away.defensesLeft, 5);
    });

    it('rejects an attack when the defending team has no defenses left', () => {
      const engine = new MatchEngine();
      engine.initializeMatch(
        team('home', 'Home', [player('attacker', 10, 0)]),
        team('away', 'Away', [player('defender', 0, 10)])
      );
      engine.teams.away.defensesLeft = 0;

      const result = engine.executeAttack('home', 'away', [], []);

      assert.equal(result.success, false);
      assert.equal(result.error, 'У команды закончились защитные действия в этом тайме');
      assert.equal(engine.teams.home.attacksLeft, 5);
    });
  });

  describe('half budgets', () => {
    it('does not end the half after five attacks in one direction', () => {
      const engine = startedMatch();
      let fifth;

      for (let i = 0; i < 5; i += 1) {
        fifth = play(engine, 'home');
        assert.equal(fifth.success, true);
      }

      assert.equal(fifth.attacksLeft, 0);
      assert.equal(fifth.halfChanged, false);
      assert.equal(fifth.matchTime, 20);
      assert.equal(fifth.matchState, 'first_half');
      assert.equal(fifth.half, 1);
      assert.equal(engine.teams.home.attacksLeft, 0);
      assert.equal(engine.teams.away.defensesLeft, 0);
      assert.equal(engine.teams.away.attacksLeft, 5);
      assert.equal(engine.teams.home.defensesLeft, 5);
      assert.equal(engine.events.some((event) => event.type === 'half_time'), false);

      const sixth = play(engine, 'home');
      assert.equal(sixth.success, false);
      assert.equal(sixth.error, 'У команды закончились атаки в этом тайме');
      assert.equal(engine.matchState, 'first_half');
      assert.equal(engine.teams.away.attacksLeft, 5);
    });

    it('does not refill budgets after five alternating attacks', () => {
      const engine = startedMatch();

      for (let i = 0; i < 5; i += 1) {
        const result = play(engine, i % 2 === 0 ? 'home' : 'away');
        assert.equal(result.success, true);
        assert.equal(result.halfChanged, false);
      }

      const state = engine.getMatchState();
      assert.equal(state.matchState, 'first_half');
      assert.equal(state.half, 1);
      assert.equal(state.matchTime, 20);
      assert.equal(state.teams.home.attacksLeft, 2);
      assert.equal(state.teams.away.attacksLeft, 3);
      assert.equal(state.teams.home.defensesLeft, 3);
      assert.equal(state.teams.away.defensesLeft, 2);
      assert.equal(engine.events.some((event) => event.type === 'half_time'), false);
    });

    it('opens the second half only when both teams have spent five attacks', () => {
      const engine = startedMatch();
      engine.teams.home.attacksLeft = 1;
      engine.teams.away.attacksLeft = 1;
      engine.teams.home.defensesLeft = 1;
      engine.teams.away.defensesLeft = 1;

      const first = play(engine, 'home');
      assert.equal(first.halfChanged, false);
      assert.equal(engine.matchState, 'first_half');

      const closing = play(engine, 'away');
      const types = engine.events.map((event) => event.type);
      const halfTimeAt = types.lastIndexOf('half_time');

      assert.equal(closing.success, true);
      assert.equal(closing.halfChanged, true);
      assert.equal(closing.matchState, 'second_half');
      assert.equal(closing.half, 2);
      assert.equal(closing.matchTime, 45);
      assert.equal(closing.attacksLeft, 5);
      assert.equal(closing.defensesLeft, 5);
      assert.equal(types[halfTimeAt - 1], 'attack');
      assert.equal(engine.teams.home.attacksLeft, 5);
      assert.equal(engine.teams.home.defensesLeft, 5);
      assert.equal(engine.teams.away.attacksLeft, 5);
      assert.equal(engine.teams.away.defensesLeft, 5);
      assert.equal(engine.getMatchState().matchState, 'second_half');
    });

    it('spends a second-half attack without refilling', () => {
      const engine = startedMatch();
      engine.teams.home.attacksLeft = 1;
      engine.teams.away.attacksLeft = 1;
      engine.teams.home.defensesLeft = 1;
      engine.teams.away.defensesLeft = 1;
      play(engine, 'home');
      play(engine, 'away');

      const result = play(engine, 'home');

      assert.equal(result.success, true);
      assert.equal(result.halfChanged, false);
      assert.equal(result.attacksLeft, 4);
      assert.equal(result.matchState, 'second_half');
      assert.equal(engine.half, 2);
      assert.equal(engine.teams.home.attacksLeft, 4);
      assert.equal(engine.teams.away.attacksLeft, 5);
      assert.equal(engine.events.filter((event) => event.type === 'half_time').length, 1);
    });

    it('marks full time at 90 and rejects another attack without refilling', () => {
      const engine = startedMatch();
      let side = 'home';

      for (let half = 0; half < 2; half += 1) {
        for (let i = 0; i < 10; i += 1) {
          const result = play(engine, side);
          assert.equal(result.success, true);
          side = side === 'home' ? 'away' : 'home';
        }
      }

      assert.equal(engine.matchState, 'second_half');
      assert.equal(engine.half, 2);
      assert.equal(engine.matchTime, 90);
      assert.equal(engine.teams.home.attacksLeft, 0);
      assert.equal(engine.teams.away.attacksLeft, 0);
      assert.equal(engine.teams.home.defensesLeft, 0);
      assert.equal(engine.teams.away.defensesLeft, 0);
      assert.equal(engine.events.some((event) => event.type === 'full_time'), true);

      const extra = play(engine, 'home');
      assert.equal(extra.success, false);
      assert.equal(extra.error, 'У команды закончились атаки в этом тайме');
      assert.equal(engine.teams.home.attacksLeft, 0);
      assert.equal(engine.teams.away.attacksLeft, 0);
      assert.equal(engine.matchState, 'second_half');
    });
  });

  describe('finishMatch', () => {
    it('totals goals from goal outcomes only', () => {
      const engine = new MatchEngine();
      const home = team('home', 'Home', [player('attacker', 80, 0)]);
      const away = team('away', 'Away', [player('defender', 0, 40)]);
      engine.initializeMatch(home, away);

      const goal = engine.executeAttack('home', 'away', [], []);
      assert.equal(goal.outcome, 'goal');

      const ended = engine.finishMatch();

      assert.equal(ended.success, true);
      assert.equal(ended.finalScore.home, 1);
      assert.equal(ended.finalScore.away, undefined);
      assert.equal(engine.getMatchState().matchState, 'finished');
    });
  });
});
