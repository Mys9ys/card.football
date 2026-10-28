# Backlog

> Ведёт @agent-pm. Lead может править приоритеты.
> Срез: ROADMAP Фаза 2 (ядро) и Фаза 3 (мобильный клиент). Онлайн, сервер и сторы — не здесь.

## В работе

_(пусто)_

## Ready

_(пусто — следующий срез: wiring `copy-ru` в mobile / shared `game_logic` / UI Icebox.)_

## Ожидает зависимости

_(пусто)_

## Сделано

### CF-108: Строки интерфейса RU
**Content (Lead):** `docs/content/copy-ru.md` — ключи EN, тексты RU, чеклист для Frontend.

### CF-109: Пять art direction + выбор «Шарик»
**UX + заказчик:** 5 directions, preview, `chosen-bubble.md`, `image-prompts.md`. Выбрано **Bubble / Шарик**.

### CF-110: Bubble в mobile + polish коллекции
**Lead:** тема, CardItem, вкладки; Collection empty/error/CTA; Lv. на карте. Портреты-вариации — Content позже. PackCard/Match → CF-110b.

### CF-101 + CF-102: Улучшение карт
**Lead:** `docs/mechanics/card-upgrade.md`, `upgradeCard` по cardId, тесты + `docs/qa/cf-101-card-upgrade.md`.

### CF-107: UX states (specs)
**Lead:** `docs/design/collection.md`, `packs.md`, `match.md`. Реализация Pack/Match → CF-110b; Collection частично в CF-110.

### CF-110b: Packs shop + Match Bubble
**UX design + Frontend:** витрина паков (тиры, арт, CoinIcon), CollectionStats чипы, MatchScreen на Bubble. Dev-only выбор монетки.

### CF-106: Офлайн-кубок на 8 команд
**GDD + QA (Lead):** `docs/mechanics/offline-cup.md`, `offline_cup.js` + тесты; приз 500; валидация CF-105. UI Tournament — Icebox.

### CF-104: Схема и мотивация в матче
**GDD + QA (Lead):** `docs/mechanics/match-modifiers.md`, `match_modifiers.js` + тесты; схемы и COACH_CARDS `one_play` в `match_engine`.

### CF-103: Энергия
**Lead:** `docs/mechanics/energy.md`, `game_logic/energy.js` + тесты. UI счётчика — позже.

### CF-001 / CF-001b: Match engine + таймы
**QA + GDD:** 26 тестов, `docs/mechanics/match-halves.md`, `docs/qa/cf-001-match-engine.md`.

### CF-002 / CF-002a: Профиль
**Frontend + UX + QA:** `ProfileScreen.js`, `docs/design/profile.md`, smoke `docs/qa/cf-002a-profile-smoke.md` (ручной прогон — по желанию).

### CF-105: Правила состава + тесты
**GDD + QA (Lead):** `squad_rules.js`, `docs/mechanics/squad-rules.md`, `squad_rules.test.js`, `docs/qa/cf-105-squad-rules.md`.

### CF-003: Backlog и приоритеты Фазы 2–3
**Цель:** 5–10 задач из ROADMAP с AC.  
**AC:** все задачи с ID, исполнителем, зависимостями — CF-101…CF-108.  
**Исполнитель:** @agent-pm  
**Зависимости:** нет

## Icebox

- Торговля картами между игроками (ROADMAP Фаза 2). Обмен дубликата на валюту уже описан в `CARD_COLLECTION_SYSTEM.md`. Площадка — онлайн, Фаза 5, Lead
- UI для апгрейда, энергии, валидации состава и офлайн-кубка в `mobile/` — после shared package `game_logic` → mobile (Lead)
- Shared package `game_logic` → mobile (Lead)
- Скелет `backend/` + `docs/api/README.md` (Lead)
- Нативные модули iOS/Android и публикация в сторы. Клиент уже на Expo; релиз — Фаза 6
- Полный motion-pass (Lottie на все экраны)

## Open questions

1. ~~**Lead:** офлайн-кубок~~ — **да**, MVP турниров до сервера (CF-106 после CF-001b/104/105).
2. ~~**Lead:** P2P-торговля~~ — **да**, Icebox до Фазы 5.
3. ~~**@agent-gdd (CF-103):** восстановление энергии~~ — **Lead:** +1 / 15 мин + бонус +1 за матч (`energy.md`).
4. ~~**Lead (после CF-109):** hybrid?~~ — **нет**, берём **Шарик** как есть (`chosen-bubble.md`).
5. **Lead / Content:** пайплайн портретов — generated cartoon по `image-prompts.md` (разные причёски), не фото.
