const { Store } = require("../models");

class StoreServices {
  /**
   *
   *
   * @static
   * @param {String} name
   * @param {String} owner
   * @returns {Object} a store object
   * @memberof StoreServices
   */
  static async createStore(name, owner) {
    try {
      const store = await Store.getStoreByUser(owner);
      if (store !== null) {
        return Promise.resolve(store);
      }
      return await Promise.resolve(new Store({ name, owner }).save());
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

module.exports = StoreServices;
