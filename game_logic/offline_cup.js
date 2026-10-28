'use strict';

// Offline 8-team cup — docs/mechanics/offline-cup.md

const MatchEngine = require('./match_engine');
const { validateSquad } = require('./squad_rules');

const CUP_SIZE = 8;
const WINNER_PRIZE = 500;

function slotsToPlayers(slots) {
  const lines = ['goalkeeper', 'defender', 'midfielder', 'attacker'];
  const players = [];
  for (const line of lines) {
    for (const card of slots[line] || []) {
      players.push({
        id: card.id,
        position: card.position,
        attack: Number(card.attack) || 0,
        defense: Number(card.defense) || 0,
      });
    }
  }
  return players;
}

function toMatchTeam(entry) {
  return {
    id: entry.id,
    name: entry.name,
    formation: entry.formation,
    players: entry.players && entry.players.length
      ? entry.players
      : slotsToPlayers(entry.slots),
  };
}

function sumAttack(team) {
  return (team.players || []).reduce((s, p) => s + (p.attack || 0), 0);
}

/**
 * Full match with empty attack/defense sets. Kickoff and RNG injectable via Math.random override.
 */
function simulateCupMatch(teamAInput, teamBInput, options = {}) {
  const random = typeof options.random === 'function' ? options.random : Math.random;
  const originalRandom = Math.random;
  Math.random = random;

  try {
    const teamA = toMatchTeam(teamAInput);
    const teamB = toMatchTeam(teamBInput);
    const engine = new MatchEngine();
    engine.initializeMatch(teamA, teamB);

    const first = engine.currentPossession;
    const second = first === teamA.id ? teamB.id : teamA.id;
    const order = [first, second];

    for (let half = 0; half < 2; half++) {
      for (let round = 0; round < 5; round++) {
        for (const attackerId of order) {
          const defenderId = attackerId === teamA.id ? teamB.id : teamA.id;
          const played = engine.executeAttack(attackerId, defenderId, [], []);
          if (!played.success) {
            return { success: false, error: played.error };
          }
        }
      }
    }

    const finished = engine.finishMatch();
    const scoreA = finished.finalScore[teamA.id] || 0;
    const scoreB = finished.finalScore[teamB.id] || 0;

    let winnerId;
    if (scoreA > scoreB) {
      winnerId = teamA.id;
    } else if (scoreB > scoreA) {
      winnerId = teamB.id;
    } else {
      const sumA = sumAttack(teamA);
      const sumB = sumAttack(teamB);
      winnerId = sumA >= sumB ? teamA.id : teamB.id;
    }

    return {
      success: true,
      winnerId,
      finalScore: {
        [teamA.id]: scoreA,
        [teamB.id]: scoreB,
      },
      events: finished.events,
      homeId: teamA.id,
      awayId: teamB.id,
    };
  } finally {
    Math.random = originalRandom;
  }
}

function startOfflineCup(entries) {
  if (!Array.isArray(entries) || entries.length !== CUP_SIZE) {
    return { success: false, error: 'cup_size' };
  }

  const seen = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry.id !== 'string' || !entry.id) {
      return { success: false, error: 'invalid_squad', teamId: entry && entry.id };
    }
    if (seen.has(entry.id)) {
      return { success: false, error: 'duplicate_team_id', teamId: entry.id };
    }
    seen.add(entry.id);

    const check = validateSquad(entry.formation, entry.slots);
    if (!check.success) {
      return {
        success: false,
        error: 'invalid_squad',
        teamId: entry.id,
        squadError: check.error,
      };
    }
  }

  return {
    success: true,
    cup: {
      teams: entries.map((e) => ({
        id: e.id,
        name: e.name,
        formation: e.formation,
        slots: e.slots,
        players: e.players,
      })),
      prize: WINNER_PRIZE,
    },
  };
}

function pairWinners(teams, results, random) {
  const winners = [];
  const matches = [];
  for (let i = 0; i < teams.length; i += 2) {
    const a = teams[i];
    const b = teams[i + 1];
    const played = simulateCupMatch(a, b, { random });
    if (!played.success) {
      return { success: false, error: played.error };
    }
    matches.push({
      round: results.round,
      homeId: a.id,
      awayId: b.id,
      winnerId: played.winnerId,
      finalScore: played.finalScore,
    });
    winners.push(teams.find((t) => t.id === played.winnerId));
  }
  return { success: true, winners, matches };
}

function runOfflineCup(cup, options = {}) {
  if (!cup || !Array.isArray(cup.teams) || cup.teams.length !== CUP_SIZE) {
    return { success: false, error: 'cup_size' };
  }

  const random = typeof options.random === 'function' ? options.random : () => 0.5;
  const allMatches = [];

  let qf = pairWinners(cup.teams, { round: 'quarterfinal' }, random);
  if (!qf.success) return qf;
  allMatches.push(...qf.matches);

  let sf = pairWinners(qf.winners, { round: 'semifinal' }, random);
  if (!sf.success) return sf;
  allMatches.push(...sf.matches);

  let fin = pairWinners(sf.winners, { round: 'final' }, random);
  if (!fin.success) return fin;
  allMatches.push(...fin.matches);

  const championId = fin.winners[0].id;
  return {
    success: true,
    championId,
    prize: WINNER_PRIZE,
    matches: allMatches,
  };
}

module.exports = {
  CUP_SIZE,
  WINNER_PRIZE,
  startOfflineCup,
  runOfflineCup,
  simulateCupMatch,
  slotsToPlayers,
};
