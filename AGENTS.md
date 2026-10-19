# Оркестр агентов — «Карточный футбол»

Главный разработчик и **backend** — сессия с Lead в Cursor (основной чат). Специализированные роли — через **Rules** в `.cursor/rules/` (подключай `@`-именем или открывай файлы из scope).

## Состав (первая половина — MVP-6)

| Rule | Роль | Когда вызывать |
|------|------|----------------|
| `@agent-pm` | Product / PM | Приоритеты, спринт, acceptance criteria, `docs/backlog.md` |
| `@agent-gdd` | Game Designer | Механики, типы карт, изменения концепции, правки `game_logic/` |
| `@agent-ux` | UX/UI (+ art briefs) | Экраны, состояния, визуальные брифы, `docs/design/` |
| `@agent-frontend-rn` | Frontend RN | Реализация UI в `mobile/CardFootball/`, Expo 54 |
| `@agent-qa` | QA / Tester | Чеклисты, unit-тесты матча и паков, регресс |
| `@agent-content` | Content / Data | Игроки, тексты, редкости, `player_cards`, локализация |

Всегда активно: **`project-core`** — стек, канон `game_logic/`, язык, границы.

## Порядок работ (конвейер)

```
PM → GDD → (Content + Balance*) → UX → Frontend → QA → Lead (интеграция / API)
         ↑__________________________|
```

\* Balance пока в зоне `@agent-gdd` + `@agent-qa` (симуляции матчей).

**Backend (Node, Mongo, auth, online)** — только Lead. API-контракты: черновик в `docs/api/` по запросу Lead, без отдельного backend-агента на этом этапе.

## Жёсткие границы

- **Канон игровой логики:** только `game_logic/`. Не править `mobile/CardFootball/game_logic/` — legacy-копия, снимем при shared-модуле (Lead).
- **Frontend** не меняет баланс и правила матча в коде — только через GDD + правки в `game_logic/`.
- Любое новое API — сначала описание в `docs/api/` (Lead утверждает), потом mobile.

## Handoff (конец каждой задачи агента)

1. **Сделано** — список файлов / артефактов  
2. **Acceptance criteria** — проверяемые пункты  
3. **Open questions** — кому передать (следующий rule или Lead)

Подробнее: [docs/WORKFLOW.md](docs/WORKFLOW.md).

## Вторая половина (позже)

- `@agent-architect` — ADR, API, границы модулей  
- `@agent-balance` — массовые симуляции, метрики  
- `@agent-narrative` — сценарии матча, flavor (можно временно через `@agent-content`)  
- `@agent-devops` — CI, EAS, Docker  

## Как создавать новых агентов

См. раздел «План добавления агентов» в [docs/WORKFLOW.md](docs/WORKFLOW.md).
