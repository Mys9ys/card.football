# Workflow и план создания агентов

## Принципы

- **Spec-first:** без acceptance criteria от PM (или Lead) — код не пишем.
- **Язык:** документы и ответы агентов — **русский**; код, имена файлов, идентификаторы — **English**.
- **Один канон логики:** `game_logic/`; mobile только UI и вызовы (пока — локальная копия logic не трогается агентами).

## Definition of Done (общий)

- [ ] Задача привязана к пункту ROADMAP или `docs/backlog.md`
- [ ] Acceptance criteria выполнены
- [ ] Нет правок вне scope rule (см. `.cursor/rules/`)
- [ ] QA прогнан для logic/UI (по scope задачи)
- [ ] Open questions закрыты или переданы Lead

## Конвейер по типу задачи

| Тип | Цепочка |
|-----|---------|
| Новая механика | PM → GDD → QA (тесты) → Lead при необходимости API |
| Новый экран | PM → UX → Frontend → QA |
| Новые карты/игроки | Content → GDD (статы) → QA |
| Backend / online | Lead (+ черновик `docs/api/` перед mobile) |

## План добавления нового агента (чеклист)

1. **Роль** — одна ответственность, не пересекается с существующими rules.
2. **Scope** — таблица: `можно трогать` / `нельзя` / `только read`.
3. **Файл** — `.cursor/rules/agent-<name>.mdc`:
   - `description` — одна строка для picker
   - `globs` — если rule включается по файлам; иначе `alwaysApply: false` и вызов через `@`
   - тело **≤ 50 строк**: промпт, deliverables, запреты, handoff
4. **Строка в `AGENTS.md`** — таблица + когда вызывать.
5. **Папка артефактов** — например `docs/design/`, `docs/content/` (при необходимости).
6. **Пробный прогон** — одна маленькая задача end-to-end через конвейер.

## Структура артефактов

```
docs/
  backlog.md          # PM, приоритеты (создать при первом спринте)
  WORKFLOW.md         # этот файл
  design/             # UX: экраны, flows, art briefs
  content/            # Content: copy, таблицы игроков
  api/                # Lead: контракты REST/WS
  adr/                # позже Architect: решения
```

## Первый спринт оркестра (рекомендация)

1. **PM** — нарезать Фазу 2–3 ROADMAP → `docs/backlog.md` (5–10 задач).
2. **GDD** — закрыть пробелы: улучшение карт, энергия (краткие specs в `docs/mechanics/`).
3. **UX** — Profile screen + polish Collection/Match (states).
4. **Frontend** — по UX-спекам.
5. **QA** — Jest (или node test) на `match_engine.js`, сценарии из GAME_CONCEPT.
6. **Lead** — ADR shared package + скелет `backend/` когда дойдёте до Фазы 4.

## Связь с Cursor

- Rules: `.cursor/rules/*.mdc`
- Оркестрация: корневой `AGENTS.md`
- Subagents (Bugbot, Security) — по skills, не путать с game agents
