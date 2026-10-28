# Офлайн-кубок на 8 команд

Канон: `game_logic/offline_cup.js`. Каждый матч — через `MatchEngine` (`match_engine.js`). Состав в кубок — только если `validateSquad` (CF-105) вернул success.

UI `TournamentScreen` в этот тикет не входит (Icebox до shared-модуля).

## Числа

| Параметр | Значение |
|----------|----------|
| Команд в сетке | 8 |
| Система | Олимпийская (четвертьфинал → полуфинал → финал) |
| Матчей | 7 (4 + 2 + 1) |
| Приз победителю | **500** валюты (`WINNER_PRIZE`) |
| Ничья по голам | побеждает команда с большим суммарным `attack` игроков; при равенстве — первая в паре (хозяин слота) |

Розыгрыши в матче кубка — автосимуляция пустыми наборами атаки/защиты (по 5 атак с каждой стороны за тайм, как в match-halves). Модификаторы схемы из CF-104 учитываются через `team.formation`.

## Контракт

```javascript
startOfflineCup(entries)
// entries: 8 × { id, name, formation, slots, players? }
// slots — как в validateSquad; players — опционально статы для MatchEngine
// → { success: true, cup } | { success: false, error, teamId?, squadError? }

runOfflineCup(cup, { random? })
// → { success, championId, prize, matches[] }

simulateCupMatch(teamA, teamB, { random? })
// один матч MatchEngine → { winnerId, finalScore, events }
```

Ошибки старта: `cup_size` (не 8), `invalid_squad` (+ `teamId`, `squadError` из CF-105), `duplicate_team_id`.

Сетка: пары `(0–1), (2–3), (4–5), (6–7)` в порядке `entries`. Победитель пары 0 и пары 1 → полуфинал 1; пары 2 и 3 → полуфинал 2; победители ПФ → финал.

## Сценарии для QA

1. **Given** 8 валидных составов 4-4-2, команда `strong` заметно сильнее остальных по attack/defense, **when** `runOfflineCup`, **then** `championId === 'strong'`, `prize === 500`, в `matches` есть финал с победителем `strong`.
2. **Given** 8 команд, `weak` слабее соперника в первой паре, **when** кубок сыгран, **then** `weak` отсутствует среди победителей четвертьфиналов (поражение в первом раунде).
3. **Given** 8 entries, у одной `validateSquad` падает, **when** `startOfflineCup`, **then** `success: false`, `error: 'invalid_squad'`.
