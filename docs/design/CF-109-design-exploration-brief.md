# CF-109 — 5 направлений визуального стиля приложения

**Исполнитель:** @agent-ux  
**Цель:** подготовить **5 различных art direction** для «Карточный футбол», чтобы заказчик выбрал один стиль перед массовой проработкой UI и **карточек коллекции**.  
**Не в scope:** финальные макеты Figma, код React Native, генерация PNG (только spec + при необходимости CSS-подобные токены для RN).

## Контекст

- Клиент: Expo RN, вкладки Пакеты / Коллекция / Команда / Профиль.
- Сейчас UI функциональный, но **сырой**: generic blue `#0066cc`, простые прямоугольники, карты без «collectible feel».
- UX-правила: touch ≥ 44pt, states loading/empty/error, RU copy — см. `docs/design/profile.md`, CF-107.
- Карточка игрока: редкость (common → legendary), статы, позиция — см. `CardItem.js`, `player_cards.js`.

## Deliverables

Создать **`docs/design/directions/`** с **5 файлами**:

| # | Файл | Рабочее имя направления |
|---|------|-------------------------|
| 1 | `direction-01-stadium-night.md` | *(UX придумывает название)* |
| 2 | `direction-02-paper-panini.md` | |
| 3 | `direction-03-neon-esports.md` | |
| 4 | `direction-04-premium-minimal.md` | |
| 5 | `direction-05-retro-arcade.md` | |

Имена направлений в таблице — **примеры**, UX может переименовать, но нужны **5 чётко различимых** стиля.

### В каждом direction-XX.md (одинаковая структура)

1. **One-liner** — кому зайдёт, mood (2 предложения).
2. **Design tokens** — таблица:
   - primary / secondary / background / surface
   - rarity: common, rare, epic, legendary (border + glow + текст)
   - typography: заголовок / body / stat numbers (шрифт — системный или указать Google Font для будущего)
   - radius, shadow, spacing unit (8pt grid?)
3. **Карточка коллекции (hero)** — ASCII или bullet layout:
   - пропорции (например 3:4)
   - что на лицевой стороне: фото/силуэт, рейтинг, полоски статов, бейдж редкости
   - hover/press (scale), легендарная — анимация (описание словами)
4. **3 экрана — ключевые кадры** (описание, не код):
   - Коллекция (сетка карт)
   - Открытие пака (момент reveal)
   - Команда (поле + слоты) — учесть текущий white-screen fix, поле может быть stylized
5. **Navigation** — tab bar, header: цвета, active state.
6. **Плюсы / минусы / риски** для MVP (1–2 пункта).
7. **AC для Frontend** (3–5 проверяемых пунктов после выбора направления).

### Сводка для выбора

**`docs/design/directions/README.md`** — таблица 5 направлений: название | mood | сильная сторона | лучше для карт? (да/нет) | рекомендация UX (1 строка).

## Ограничения

- Не ломать GAME_CONCEPT и механики.
- Доступность: контраст текста на карте ≥ WCAG AA где возможно.
- Локализация RU; длина кнопок — не обрезать на 360px width.
- Учесть **пустую коллекцию** и **полную** — карта должна работать в обоих контекстах.

## Handoff

- Commit: `CF-109: five UI art directions`
- Обновить `docs/backlog.md` → Сделано
- Заказчик выбирает **один** direction → новая задача **CF-110** (design system + card component spec для @agent-frontend-rn)

## Open questions для Lead

- Нужен ли 6-й «hybrid» после выбора?
- Иллюстрации игроков: фото, силуэты или generated art pipeline — зафиксировать в выбранном direction.
