# Copy RU — подписи экранов

Tone: динамичный спортивный комментарий, без токсичности. Ключи — English (`snake_case`), значения — русский текст как на экране сейчас (или чуть выровненный).

Frontend подставляет эти ключи вместо захардкоженных строк. Маршруты табов пока на русском (`Коллекция` и т.д.) — в таблице отдельно; переименование route names — отдельный тикет.

## Tabs (`BottomTabNavigator`)

| Key | RU |
|-----|-----|
| `tab.packs` | Пакеты |
| `tab.collection` | Коллекция |
| `tab.team` | Команда |
| `tab.profile` | Профиль |

## Common

| Key | RU |
|-----|-----|
| `common.retry` | Повторить |
| `common.cancel` | Отмена |
| `common.close` | Закрыть |
| `common.ok` | OK |
| `common.error` | Ошибка |
| `common.refresh` | Обновить |
| `common.coins` | Монет |
| `common.understand` | Понятно |

## Collection

| Key | RU |
|-----|-----|
| `collection.title` | Моя коллекция |
| `collection.loading` | Загрузка коллекции... |
| `collection.empty` | У вас пока нет карт в коллекции |
| `collection.empty_hint` | Откройте пакет — карты появятся здесь |
| `collection.open_packs_cta` | Открыть пакеты |
| `collection.stats_count` | {collected} из {total} карт |
| `collection.stats_filled` | Заполнено: {percent}% |
| `collection.stats_coins` | Монет: {amount} |
| `collection.load_error` | Не удалось загрузить коллекцию |
| `collection.card_detail` | Команда: {team}\nСтрана: {country}\n\nАтака: {attack}\nЗащита: {defense}\nСкорость: {speed}\nТехника: {technique}\n\nСпособности: {abilities}\n\nКарта {rarity} редкости |
| `collection.abilities_none` | Нет |
| `collection.album` | Альбом |

## Packs / Shop

| Key | RU |
|-----|-----|
| `packs.shop_title` | Магазин |
| `packs.shop_subtitle` | паки · купить и открыть |
| `packs.loading` | Загрузка пакетов... |
| `packs.unavailable` | Пакеты временно недоступны |
| `packs.shelf_title` | Купить пак |
| `packs.shelf_hint` | Витрина магазина — пак покупается и сразу открывается |
| `packs.tier_empty` | В этом тире пока нет паков |
| `packs.cards_count` | {count} карт |
| `packs.free` | Бесплатно |
| `packs.price_coins` | {price} монет |
| `packs.legend_chance` | Шанс легенды: {percent}% |
| `packs.tier_label` | Тир: {tier} |
| `packs.guarantee` | Гарантия: {text} |
| `packs.buy` | Купить |
| `packs.open_free` | Открыть бесплатно |
| `packs.open` | Открыть |
| `packs.buy_confirm_title` | Купить пак |
| `packs.buy_confirm_free` | Открыть «{name}» бесплатно? |
| `packs.buy_confirm_paid` | Купить «{name}» за {price} монет и сразу открыть? |
| `packs.not_enough_title` | Не хватает монет |
| `packs.not_enough_body` | Нужно {price}, у вас {current}. |
| `packs.load_error` | Не удалось загрузить данные пакетов |
| `packs.open_error` | Не удалось открыть пакет |
| `packs.opening` | Вскрываем пак... |
| `packs.result_title` | Новые карты |
| `packs.result_new` | Получено: |
| `packs.result_dupes` | Дубликаты: |
| `packs.rarity.legendary` | легенда |
| `packs.rarity.epic` | эпик |
| `packs.rarity.rare` | редкая |
| `packs.rarity.common` | обычная |
| `packs.dev_coin_picker` | Монетка (dev): |

## Match

| Key | RU |
|-----|-----|
| `match.title` | Матч |
| `match.loading` | Загрузка команд... |
| `match.load_error` | Не удалось загрузить данные |
| `match.collection_error` | Не удалось загрузить коллекцию |
| `match.empty_title` | Нет состава |
| `match.empty_body` | Откройте пакеты и соберите команду, затем возвращайтесь на матч. |
| `match.power` | Сила: {power} |
| `match.players` | Игроков: {count} |
| `match.history` | История матчей |
| `match.new_game` | Новая игра |
| `match.new_game_confirm` | Создать нового соперника и начать заново? |
| `match.start` | Начать |
| `match.win_title` | Победа! |
| `match.win_body` | Вы победили и получили 100 монет! |
| `match.opponent_cpu` | Компьютер |

## Team

| Key | RU |
|-----|-----|
| `team.title` | Состав команды |
| `team.loading` | Загрузка коллекции... |
| `team.load_error` | Не удалось загрузить коллекцию |
| `team.power_label` | Сила команды |
| `team.players_label` | Игроков |
| `team.save` | Сохранить состав |
| `team.saved_title` | Команда сохранена |
| `team.saved_body` | Ваш состав успешно сохранен! |
| `team.incomplete_title` | Команда не готова |
| `team.incomplete_body` | Заполните все слоты, чтобы сохранить состав |

## Profile

| Key | RU |
|-----|-----|
| `profile.title` | Профиль |
| `profile.subtitle` | Локальный профиль |
| `profile.loading` | Загрузка профиля... |
| `profile.load_error` | Не удалось загрузить профиль |
| `profile.section_account` | Аккаунт |
| `profile.section_matches` | Матчи |
| `profile.section_fill` | Заполнение |
| `profile.section_recommend` | Кого искать |
| `profile.collection_percent` | Коллекция заполнена на {percent}% |
| `profile.matches_empty` | Матчей ещё не было |
| `profile.collection_empty_title` | В коллекции пока нет карт |
| `profile.collection_empty_body` | Откройте пакет — новые карты появятся в профиле. |
| `profile.open_packs_cta` | Открыть пакеты |
| `profile.missing_count` | Не хватает карт: {count} |
| `profile.recommend_empty_title` | Рекомендаций нет |
| `profile.recommend_empty_body` | Каталог собран — недостающих карт не осталось. |
| `profile.power` | Сила {power} |
| `profile.activity_empty` | Пока нет событий |
| `profile.activity.packs` | Карты из пакетов |
| `profile.activity.dupes` | Дубликаты |
| `profile.activity.upgrades` | Улучшения |

## Tournament

| Key | RU |
|-----|-----|
| `tournament.title` | Турниры |
| `tournament.loading` | Загрузка турниров... |
| `tournament.load_error` | Не удалось загрузить турниры |
| `tournament.available_count` | Доступно: {count} турниров |
| `tournament.registered_count` | Записано: {count} |
| `tournament.tab_available` | Доступные |
| `tournament.tab_mine` | Мои турниры |
| `tournament.empty_available` | Нет доступных турниров |
| `tournament.empty_mine` | Вы не зарегистрированы ни на один турнир |
| `tournament.register_title` | Запись на турнир |
| `tournament.register_confirm` | Вы уверены, что хотите записаться на турнир «{name}»? |
| `tournament.register_cta` | Записаться |
| `tournament.register_success_title` | Успешно |
| `tournament.register_success_body` | Вы успешно записаны на турнир «{name}»! |
| `tournament.difficulty.easy` | Легко |
| `tournament.difficulty.medium` | Средне |
| `tournament.difficulty.hard` | Сложно |
| `tournament.difficulty.expert` | Эксперт |

## Список для Frontend (подставить вместо хардкода)

Приоритет экранов (уже в Bubble / активные вкладки):

1. `PackOpeningScreen.js` + `PackShopShelf.js` + `PackCard.js` — все ключи `packs.*`, `common.*`
2. `CollectionScreen.js` + `CollectionStats.js` — `collection.*`
3. `MatchScreen.js` — `match.*`
4. `TeamFormationScreen.js` — `team.*`
5. `ProfileScreen.js` — `profile.*`
6. `TournamentScreen.js` + `TournamentCard.js` — `tournament.*` (экран ещё на моках)
7. `BottomTabNavigator.js` — `tab.*` (осторожно: `name` маршрута сейчас = русская строка)

Рекомендуемый артефакт кода (следующий тикет): `mobile/CardFootball/i18n/ru.js` — объект `export default { 'collection.title': '…', … }` и хелпер `t(key, vars)`.
