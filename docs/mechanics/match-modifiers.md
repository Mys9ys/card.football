# Схема и мотивация в матче

Канон: `game_logic/match_modifiers.js`, подключение в `match_engine.js`. Опора: `docs/GAME_CONCEPT.md` — карты расстановки и мотивации тренера.

Модификаторы меняют **силу** атаки/защиты в розыгрыше. Лимит **5 атак / 5 защит за тайм** не трогают.

## Схемы (на весь матч, пока не сменили состав)

Числа — аддитивный бонус к `attackPower` / `defensePower` команды с этой схемой. Источник id — `CARD_TYPES.FORMATIONS`.

| Схема | Attack | Defense | Смысл |
|-------|--------|---------|--------|
| `4-4-2` | 0 | 0 | Баланс |
| `3-5-2` | +2 | +1 | Центр поля |
| `4-3-3` | +4 | −2 | Три нападающих |
| `5-3-2` | −2 | +4 | Пять защитников |
| `4-2-3-1` | +2 | +2 | Гибкость |

Неизвестная или пустая схема → `{ attack: 0, defense: 0 }`. Схема берётся из `team.formation` при инициализации / розыгрыше.

## Мотивация тренера (один розыгрыш)

Четыре карты из `CARD_TYPES.COACH_CARDS`. Эффект действует **только на тот розыгрыш**, куда карту передали; запас наборов за тайм не меняется. `duration` в данных — `one_play`.

| Id | Карта | Кто играет | Attack | Defense |
|----|-------|------------|--------|---------|
| `support` | Поддержка | любая сторона | +3 | +3 |
| `reprimand` | Выговор | любая сторона | 0 | +4 |
| `inspiring_speech` | Вдохновляющая речь | атакующий | +5 | 0 |
| `inspiring_speech` | Вдохновляющая речь | обороняющийся | 0 | +5 |
| `tactical_substitution` | Тактическая замена | атакующий | +4 | 0 |
| `tactical_substitution` | Тактическая замена | обороняющийся | 0 | +4 |

Неизвестная карта → нули. Передаётся опционально в `executeAttack` как `options.attackMotivation` / `options.defenseMotivation` (id карты).

## Контракт

```javascript
getFormationModifier(formationId)           // { attack, defense }
getMotivationModifier(cardId, role)         // role: 'attacking' | 'defending'
applyPlayModifiers({ formationId, motivationId, role })
// → { formation, motivation, attack, defense }
```

В ответе розыгрыша и в `events[].result` появляются `modifiers.attack` / `modifiers.defense` (сводка по стороне) и итоговые `attackPower` / `defensePower` уже с бонусами.

## Сценарии для QA

1. **Given** одинаковые составы и пустые наборы карт атаки/защиты, команда A со схемой `4-3-3`, команда B со схемой `5-3-2`, **when** один розыгрыш A→B без мотивации и `Math.random` зафиксирован, **then** `attackPower` A выше, чем у того же розыгрыша при схеме A = `5-3-2` (модификатор схемы разный).
2. **Given** матч идёт, у атакующего 5 атак, **when** розыгрыш с `attackMotivation: 'inspiring_speech'`, **then** `attacksLeft` уменьшается на 1 (не на 0 и не пропускается), `defense` мотивации атакующего = 0, attack-бонус = +5.
3. **Given** розыгрыш без мотивации и тот же розыгрыш с `defenseMotivation: 'reprimand'`, **when** сравнение `defensePower`, **then** со Выговором защита выше на 4 при прочих равных.
