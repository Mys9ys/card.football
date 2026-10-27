# Матч — UX (Bubble)

Стиль: Bubble. Экран: `MatchScreen.js` (+ `MatchSimulation`). Пока матч не в bottom tabs — доступ через навигацию/заглушку.

## Flow

```
Вход на матч
  → loading команды
  → empty (нет состава) → CTA «Собрать команду»
  → ready → «Начать матч»
  → playing (симуляция розыгрышей)
  → finished (счёт + кнопка «Ещё матч» / «Команда»)
  → error → «Повторить»
```

## States

| State | UI |
|-------|-----|
| loading | фон `#DFF6FF`, спиннер coral |
| empty squad | текст + CTA на «Команда» |
| ready | превью силы команд, primary CTA |
| playing | лента событий, не блокировать tab bar если матч в стеке |
| finished | счёт крупно, вторичные кнопки ≥ 44pt |
| error | сообщение + retry |

## Touch / layout

- CTA «Начать» / «Атака» ≥ 44pt, цвет `BubbleTheme.primary`.
- Убрать `#0066cc` с header/кнопок — заменить токенами Bubble.
- На телефоне: один столбец событий; на планшете — двухколоночный лог опционально.

## AC для Frontend

1. Полный рескин MatchScreen под Bubble (сейчас legacy blue).
2. Empty состава не падает белым экраном.
3. Состояния loading / playing / finished различимы без чтения логов.
4. После shared `game_logic` — вызов канон `match_engine` (не дубль mobile).
