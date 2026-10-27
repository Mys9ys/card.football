'use strict';

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const CollectionSystem = require('./collection_system');

const PLAYER = 'qa_upgrade_player';

describe('CollectionSystem.upgradeCard', () => {
  let system;
  let rareCard;

  beforeEach(() => {
    system = new CollectionSystem();
    system.initializePlayerCollection(PLAYER);
    const allCards = require('./player_cards');
    rareCard = allCards.find((c) => c.rarity === 'rare');
    assert.ok(rareCard, 'need at least one rare card in catalog');

    system.addCardsToCollection(PLAYER, [rareCard]);
    // two duplicates for first upgrade (rare →1 needs 2)
    system.addCardsToCollection(PLAYER, [rareCard, rareCard]);
  });

  it('upgrades owned card when duplicates and currency are enough', () => {
    const before = system.getPlayerCurrency(PLAYER).currency;
    const result = system.upgradeCard(PLAYER, rareCard.id, 2);

    assert.equal(result.success, true);
    assert.equal(result.upgradeLevel, 1);
    assert.equal(result.duplicatesSpent, 2);
    assert.equal(result.currencySpent, 50);
    assert.equal(system.getCardLevel(PLAYER, rareCard.id), 1);
    assert.equal(system.getPlayerCurrency(PLAYER).currency, before - 50);
  });

  it('rejects when not enough duplicates', () => {
    const collection = system.getPlayerCollection(PLAYER).collection;
    collection.cardDuplicates[rareCard.id] = 1;

    const result = system.upgradeCard(PLAYER, rareCard.id, 2);
    assert.equal(result.success, false);
    assert.equal(result.error, 'not_enough_duplicates');
    assert.equal(system.getCardLevel(PLAYER, rareCard.id), 0);
  });

  it('rejects when card is not in collection', () => {
    const result = system.upgradeCard(PLAYER, 'missing_card_xyz', 2);
    assert.equal(result.success, false);
    assert.equal(result.error, 'card_not_owned');
  });

  it('applies per-level stat bonus', () => {
    system.upgradeCard(PLAYER, rareCard.id, 2);
    const stats = system.getEffectiveStats(PLAYER, rareCard);
    assert.equal(stats.level, 1);
    assert.equal(stats.attack, rareCard.attack + 3);
    assert.equal(stats.defense, rareCard.defense + 3);
  });
});
