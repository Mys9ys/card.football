# CF-101 / CF-102 — улучшение карт

Запуск:

```bash
node --test game_logic/*.test.js
```

## Сценарий | ожидание | статус

| Сценарий | Ожидание | Статус |
|----------|----------|--------|
| Rare, 2 дубля, валюта ок | `upgradeLevel === 1`, −50 монет | pass |
| 1 дубль при required 2 | `not_enough_duplicates` | pass |
| Карты нет в коллекции | `card_not_owned` | pass |
| После Lv.1 | статы +3 (rare) | pass |

Spec: `docs/mechanics/card-upgrade.md`.
