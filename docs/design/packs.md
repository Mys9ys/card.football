# Пакеты — UX (Bubble)

Стиль: Bubble. Экран: `PackOpeningScreen.js`, ассет пака: `assets/theme/pack-bubble.jpg` (мячи, не звёзды).

## Flow

```
Таб «Пакеты»
  → список типов паков + баланс монет
  → подтверждение покупки
  → opening (Lottie / pulse)
  → success reveal (карта(ы) + дубликаты → валюта)
  → error (нехватка монет / сбой) → Alert + остаёмся на списке
```

## States

| State | UI |
|-------|-----|
| loading | пока `packs.length === 0` — спиннер / скелет списка |
| empty packs | не ожидается (каталог статический); если пусто — «Пакеты временно недоступны» |
| insufficient funds | Alert, кнопка «Купить» не зависает |
| opening | блокировка повторного тапа, анимация |
| success | модалка/экран результата; CardItem Bubble; дубликат помечен |
| error | Alert + `setIsOpening(false)` |

## Touch / layout

- Карточка пака: CTA «Купить» ≥ 44pt, цена читается на бирюзе.
- На упаковке — мячи (Bubble), не звёзды.
- Reveal: без обрезки головы на портрете (`object-position` вверх / `resizeMode cover` с запасом).

## AC для Frontend

1. `PackCard` на токенах Bubble (сейчас частично старые цвета рамки — привести к rarity Bubble).
2. Нельзя открыть второй пак, пока `isOpening`.
3. После успеха обновить баланс и статистику без полного reload экрана (тихо).
4. Web: Alert.confirm не ломает синтаксис handlers.
