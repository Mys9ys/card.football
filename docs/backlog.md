# Backlog

> Ведёт @agent-pm. Lead может править приоритеты.
> Срез: ROADMAP Фаза 2 (ядро) и Фаза 3 (мобильный клиент). Онлайн, сервер и сторы — не здесь.

## В работе

_(пусто)_

## Ready

Приоритет: **CF-103** (энергия) → **CF-104** → **CF-106**. UI: PackCard/MatchScreen под Bubble (хвост CF-110/107).

### CF-103: Энергия и действия
**Цель:** ввести лимит действий (матч, открытие пака) до серверной экономики.  
**AC:**
1) `docs/mechanics/energy.md`: максимум, стоимость матча, стоимость открытия пака, одно правило восстановления
2) новый модуль `game_logic/energy.js`: списание не уходит ниже 0 и отклоняет действие при нехватке
3) в том же spec три сценария given/when/then для QA
**Исполнитель:** @agent-gdd  
**Зависимости:** нет  
**Вне скоупа:** UI счётчика, IAP, серверное хранение энергии; не править `upgradeCard` в этой задаче  
**ROADMAP:** Фаза 2, система энергии/действий

## Ожидает зависимости

### CF-110b: PackCard + MatchScreen → Bubble
**Цель:** добить хвост CF-110/107 — PackCard и MatchScreen ещё на legacy blue.
**AC:** по `docs/design/packs.md` (Bubble redesign) и `docs/design/match.md`
**Исполнитель:** @agent-frontend-rn
**Зависимости:** CF-107 specs; packs design обновлён (CF-110b-design)
**ROADMAP:** Фаза 3

### CF-104: Схема и мотивация в матче
**Цель:** тактическая схема и карта тренера меняют розыгрыш, не ломая лимит 5 атак / 5 защит.  
**AC:**
1) `docs/mechanics/match-modifiers.md`: числовой модификатор для каждой схемы из GAME_CONCEPT (4-4-2, 3-5-2, 4-3-3, 5-3-2, 4-2-3-1)
2) четыре карты мотивации (Поддержка, Выговор, Вдохновляющая речь, Тактическая замена): эффект на один розыгрыш, лимит наборов за тайм не меняется
3) тест: при одинаковых наборах две разные схемы дают разный модификатор в результате
4) сценарии given/when/then для QA в spec
**Исполнитель:** @agent-gdd → @agent-qa  
**Зависимости:** CF-001  
**Вне скоупа:** новые иллюстрации карт, онлайн-замена по ходу матча  
**ROADMAP:** Фаза 2, тактические схемы и мотивация тренера

### CF-106: Офлайн-кубок на 8 команд
**Цель:** один локальный кубок вместо моков на `TournamentScreen` — логика в каноне, без сервера.  
**AC:**
1) `docs/mechanics/offline-cup.md`: сетка на 8 команд, олимпийская система, каждый матч через `match_engine`
2) модуль в `game_logic/`: старт кубка, победитель матча проходит дальше, приз победителю — валюта (число в spec)
3) в кубок не попадает состав, который отклоняет валидатор CF-105
4) сценарии given/when/then: победа в финале, поражение в первом раунде
**Исполнитель:** @agent-gdd → @agent-qa  
**Зависимости:** CF-001, CF-104, CF-105  
**Вне скоупа:** лиги, рейтинг, друзья, серверная регистрация; подключение `TournamentScreen` — Icebox до shared-модуля  
**ROADMAP:** Фаза 2, система турниров (только офлайн-кубок)

### CF-108: Строки интерфейса RU
**Цель:** собрать подписи существующих экранов в одном файле копирайта.  
**AC:**
1) `docs/content/copy-ru.md` покрывает подписи Collection, Match, Pack, Team, Profile, Tournament (кнопки, пустые состояния, ошибки)
2) ключи на English, тексты на русском
3) список ключей, которые Frontend должен подставить вместо захардкоженных строк
**Исполнитель:** @agent-content → @agent-frontend-rn  
**Зависимости:** CF-002, CF-107  
**Вне скоупа:** комментатор матча, другие языки  
**ROADMAP:** Фаза 3, локализация

## Сделано

### CF-109: Пять art direction + выбор «Шарик»
**UX + заказчик:** 5 directions, preview, `chosen-bubble.md`, `image-prompts.md`. Выбрано **Bubble / Шарик**.

### CF-110: Bubble в mobile + polish коллекции
**Lead:** тема, CardItem, вкладки; Collection empty/error/CTA; Lv. на карте. Портреты-вариации — Content позже. PackCard/Match → CF-110b.

### CF-101 + CF-102: Улучшение карт
**Lead:** `docs/mechanics/card-upgrade.md`, `upgradeCard` по cardId, тесты + `docs/qa/cf-101-card-upgrade.md`.

### CF-107: UX states (specs)
**Lead:** `docs/design/collection.md`, `packs.md`, `match.md`. Реализация Pack/Match → CF-110b; Collection частично в CF-110.

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
3. **@agent-gdd (CF-103):** восстановление энергии — **Lead:** таймер (1 ед./N мин) + небольшой бонус за сыгранный матч; зафиксировать в spec.
4. ~~**Lead (после CF-109):** hybrid?~~ — **нет**, берём **Шарик** как есть (`chosen-bubble.md`).
5. **Lead / Content:** пайплайн портретов — generated cartoon по `image-prompts.md` (разные причёски), не фото.
