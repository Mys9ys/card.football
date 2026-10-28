# Энергия и действия

Канон: `game_logic/energy.js`. До серверной экономики — локальный лимит действий.

## Числа

| Параметр | Значение |
|----------|----------|
| Максимум | 10 |
| Старт для нового игрока | 10 |
| Стоимость открытия пака | 1 |
| Стоимость матча | 2 |
| Восстановление | +1 каждые **15 минут** (по wall-clock) |
| Бонус за сыгранный матч | +1 (не выше максимума) |

Восстановление по таймеру применяется при любом чтении/списании (`applyRegen`). Бонус за матч — отдельный вызов `grantMatchBonus` после завершения матча (UI/сервис позже).

## Контракт

```javascript
createEnergyState(nowMs?)           // { energy, max, lastRegenAt }
canAfford(state, cost)              // boolean
spendEnergy(state, cost, nowMs?)    // { success, state, error? }
applyRegen(state, nowMs?)           // state с начисленным regen
grantMatchBonus(state, nowMs?)      // +1 после матча
getEnergySnapshot(state, nowMs?)    // { energy, max, nextRegenInMs }
```

Ошибки списания: `not_enough_energy`.

## Сценарии для QA

1. **Given** energy=1, **when** `spendEnergy(state, 1)`, **then** success, energy=0.
2. **Given** energy=0, **when** `spendEnergy(state, 1)`, **then** `not_enough_energy`, state без изменений по энергии (после regen всё ещё 0 если таймер не прошёл).
3. **Given** energy=5, lastRegenAt = now − 30 мин, **when** `applyRegen`, **then** energy=7 (два тика по 15 мин), не выше max.
