# Коллекция — UX (Bubble)

Стиль: `docs/design/directions/chosen-bubble.md`. Экран: `CollectionScreen.js`, карта: `CardItem.js`.

## Flow

```
Таб «Коллекция»
  → loading (спиннер primary)
  → error → «Повторить»
  → success
       ├─ empty → CTA «Открыть пакеты» → таб Пакеты
       └─ grid 2 кол (телефон) / фильтры + поиск
```

## States

| State | UI |
|-------|-----|
| loading | header Bubble + ActivityIndicator `#FF6B8A` |
| empty | текст + hint + pill CTA ≥ 44pt |
| error | текст ошибки + «Повторить» |
| success | чипы редкости/позиции (active: coral + белый текст), сетка CardItem |
| filter-empty | сетка пуста при активном фильтре — тот же empty без CTA паков (можно «Сбросить фильтр» позже) |

## Touch / layout

- Чипы фильтров ≥ 44pt, горизонтальный wrap на 360px.
- Карта: высота фикс. 262, OVR-круг, pill редкости, только амплуа.
- Планшет ≥ 600pt: `numColumns={4}` (AC для Frontend — добавить при polish).

## AC для Frontend

1. Все цвета из `BubbleTheme`, не `#0066cc`.
2. Empty ведёт на «Пакеты».
3. Active-фильтр: белый текст на coral.
4. Error + retry без Alert-only.
