import { db } from '../../db.mjs'

/**
 * @typedef {Object} ShoppingItem
 * @property {string} name
 * @property {number} price
 */
export class ShoppingListModel {
  getAll() {
    return db.dataJSON.items ?? []
  }
  /**
   * 
   * @param {string} name 
   * @returns {ShoppingItem}
   */
  getOne(name) {
    return (db.dataJSON.items??[]).find(item => item.name === name)??null
  }

  /**
   * 
   * @param {ShoppingItem} item 
   */
  create(item) {
    /** @type {ShoppingItem[]} */
    const items = db.dataJSON.items??[]
    if (items.find(i => i.name === item.name)) {
      throw new Error('Item already exists')
    }
    items.push(item)
    db.write({items})
    return item
  }

  /**
   * 
   * @param {ShoppingItem} item 
   */
  update(item) {
    const items = db.dataJSON.items??[]
    const itemIndex = items.findIndex(i => i.name === item.name)
    if (itemIndex === -1) {
      throw new Error('Item not found')
    }
    items[itemIndex] = item
    db.write({items})
  }

  /**
   * 
   * @param {string} name 
   */
  delete(name) {
    /** @type {ShoppingItem[]} */
    const items = db.dataJSON.items??[]
    const itemIndex = items.findIndex(i => i.name === name)
    if (itemIndex === -1) {
      return true
    }
    items.splice(itemIndex, 1)
    db.write({items})
  }
}