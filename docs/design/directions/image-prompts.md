# Промпты генерации арта — стиль «Шарик»

Использовать при генерации новых персонажей, паков и баннеров. Стиль: soft cartoon, thick outline, cute, turquoise + coral accents.

## Игрок (портрет карты, 3:4)

Базовый промпт:

```
Cartoon football player portrait vertical 3:4 for a collectible card, soft thick outline, cute style, young male with [HAIR], fully visible head with empty sky space above the hair so nothing is cropped, turquoise jersey with coral accents, big friendly eyes, centered bust, bright soft background clouds, no text
```

Подстановки `[HAIR]` (примеры):

- `short brown hair`
- `curly black hair`
- `blond spiky hair`
- `long tied ponytail`
- `bald with headband`
- `red messy hair`
- `dark buzz cut`
- `blue dyed undercut` (легендарные / особые)

Вариации амплуа (добавить в конец):

- ВР: `goalkeeper gloves visible, slightly wider stance`
- ЗЩ: `stoic expression, arms crossed`
- ПЗ: `holding a football under one arm`
- АТ: `running pose, wind in hair`

## Пак (3:4)

Базовый:

```
Cute cartoon sealed football card pack packaging, soft rounded turquoise and coral candy colors, thick black outline, decorated with classic black and white soccer footballs instead of stars, playful sticker pack mood, no readable text, vertical 3:4
```

Тиры (ассеты `mobile/CardFootball/assets/theme/`):

| Тир | Файл | Палитра в промпте |
|-----|------|-------------------|
| common | `pack-common.jpg` | soft silver-blue / cool gray candy |
| rare | `pack-rare.jpg` | bright turquoise + coral |
| epic | `pack-epic.jpg` | purple violet + lavender candy |
| legendary | `pack-legendary.jpg` | warm golden yellow + coral, subtle gold foil |

Маппинг pack.id → тир: starter→common, standard→rare, premium/defense_pack→epic, legendary/golden_legends→legendary.

## Поле команды (16:9)

```
Cute cartoon football pitch top-down, bright green rounded grass, thick outlines, playful toy field, turquoise sky edges, no players, no text, 16:9
```

## Баннер профиля (16:9)

```
Cute cartoon profile header banner, soft turquoise coral sky with stars and football, thick outlines, playful, no text, 16:9
```

## Меню-превью стиля (1:1)

```
Square app menu thumbnail for a cartoon football card game style. Soft rounded candy colors, thick black outline, cute stylized football player sticker, bright turquoise and coral, playful kids animation mood, no text, no logos, flat illustration 1:1
```

## Монетка (1:1)

Ассеты: `coin-v1.jpg` / `coin-v2.jpg` / `coin-v3.jpg` в `assets/theme/`. Активный вариант — `CoinIcon` / `setActiveCoinVariant`.

| # | Идея |
|---|------|
| v1 | Золотая монета, футбольный мяч выбит в центре |
| v2 | Золотая монета, сверху «прилип» маленький мяч |
| v3 | Золотая монета с рельефом гексов мяча |

```
Golden game coin icon, round gold medal coin, embossed classic black and white soccer football in the center, thick soft cartoon outline Bubble style, shiny metal rim, cute sticker look, plain soft turquoise background, no text, centered, square
```

## Правила

1. Всегда оставлять **воздух над головой** — иначе кроп карты срежет причёску.
2. На паке — **мячи**, не звёзды.
3. Без читаемого текста на картинке (подписи рисует UI).
4. Одна и та же палитра: бирюза / коралл / мягкий голубой фон.
