# CF-105 — unit-тесты validateSquad

Запуск из корня репозитория:

```bash
node --test game_logic/*.test.js
```

## Сценарий | ожидание | статус

| Сценарий | Ожидание | Статус |
|----------|----------|--------|
| Валидный 4-4-2, все id уникальны | `{ success: true }` | pass |
| Spec QA #1: `goalkeeper: []`, остальные линии 4-4-2 | `missing_goalkeeper` | pass |
| Spec QA #2: слоты 4-4-2, схема `4-3-3` | `slot_count` | pass |
| Spec QA #3: дубликат `id` у защитников | `duplicate_card` | pass |

Прогон: 4 теста в `squad_rules.test.js`; полный каталог logic — 30 тестов (с match engine).
