# Улучшение карт

Канон: `upgradeCard` в `game_logic/collection_system.js`. Опора: `docs/CARD_COLLECTION_SYSTEM.md`.

Уровень хранится **по `cardId`** в `collection.cardLevels`. Дубликаты по картам — в `collection.cardDuplicates`. Глобальный счётчик `duplicateCards` остаётся суммой для статистики.

Максимальный уровень: **3**. Уровень 0 = карта без апгрейда.

## Стоимость перехода на следующий уровень

| Редкость | →1: дубл. / валюта | →2: дубл. / валюта | →3: дубл. / валюта | Бонус к каждому стату за уровень |
|----------|--------------------|--------------------|--------------------|----------------------------------|
| common | 2 / 20 | 3 / 50 | 5 / 100 | +2 |
| rare | 2 / 50 | 3 / 120 | 4 / 250 | +3 |
| epic | 2 / 150 | 3 / 350 | 4 / 700 | +4 |
| legendary | 1 / 400 | 2 / 900 | 3 / 1800 | +5 |

Бонус применяется к `attack`, `defense`, `speed`, `technique` (не к `stamina` в MVP). Эффективный стат = база + `level * bonusPerLevel`.

## Контракт

```javascript
upgradeCard(playerId, cardId, duplicateCount)
```

- `duplicateCount` — сколько дубликатов игрок готов потратить. Должен быть **≥** требуемых для следующего уровня; списывается ровно `required`.
- Успех: `{ success: true, upgradeLevel, duplicatesSpent, currencySpent, remainingDuplicates, remainingCurrency }`.
- Отказ: `{ success: false, error }` — код из таблицы.

| `error` | Когда |
|---------|--------|
| `collection_not_found` | нет коллекции |
| `card_not_owned` | карты нет в `cards` |
| `unknown_rarity` | редкость не из таблицы |
| `max_level` | уже уровень 3 |
| `not_enough_duplicates` | `cardDuplicates[cardId]` < required или `duplicateCount` < required |
| `not_enough_currency` | валюты меньше стоимости |

## Сценарии для QA

1. **Given** карта rare в коллекции, `cardDuplicates[id]=2`, валюта ≥ 50, уровень 0, **when** `upgradeCard(pid, id, 2)`, **then** `success: true`, `upgradeLevel === 1`, дубликаты 0, валюта −50.
2. **Given** та же карта, дубликатов 1, **when** `upgradeCard(pid, id, 2)`, **then** `success: false`, `error: 'not_enough_duplicates'`.
3. **Given** карты нет в `cards`, **when** `upgradeCard(...)`, **then** `error: 'card_not_owned'`.
