// ============================================================================
// INNER AWAKENING - CHARACTER EQUIPMENT MANAGER
// ============================================================================
import { ITEM_DATABASE, INITIAL_EQUIPMENT } from '../data/itemDatabase';

class EquipmentManagerService {
  constructor() {
    this.listeners = new Set();
  }

  // Subscribe to equipment changes
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Notify listeners
  notify(event) {
    this.listeners.forEach(callback => {
      try {
        callback(event);
      } catch (err) {
        console.error('Error in equipment listener:', err);
      }
    });
  }

  // Find item in database by ID
  getItem(itemId) {
    return ITEM_DATABASE.find(item => item.itemId === itemId) || null;
  }

  // Filter items by slot or category
  getItemsBySlot(slot) {
    if (!slot || slot === 'all') {
      return ITEM_DATABASE.filter(item => item.category === 'FASHION');
    }
    return ITEM_DATABASE.filter(item => item.slot === slot);
  }

  // Calculate total stat bonuses from an equipment map
  calculateStatBonuses(equippedMap) {
    const totals = { strength: 0, stamina: 0, agility: 0, mana: 0 };
    if (!equippedMap) return totals;

    Object.values(equippedMap).forEach(itemId => {
      if (!itemId) return;
      const item = this.getItem(itemId);
      if (item && item.stats) {
        if (item.stats.strength) totals.strength += item.stats.strength;
        if (item.stats.stamina) totals.stamina += item.stats.stamina;
        if (item.stats.agility) totals.agility += item.stats.agility;
        if (item.stats.mana) totals.mana += item.stats.mana;
      }
    });
    return totals;
  }

  // Validate if item can be equipped
  validateEquip(itemId, ownedItemIds = []) {
    const item = this.getItem(itemId);
    if (!item) {
      return { success: false, reason: 'Item not found in database' };
    }
    const isOwned = item.isOwned || ownedItemIds.includes(itemId);
    if (!isOwned) {
      return { success: false, reason: 'Item is locked. Complete unlock criteria first.', item };
    }
    return { success: true, item };
  }
}

export const equipmentManager = new EquipmentManagerService();
