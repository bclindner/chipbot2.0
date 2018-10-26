/**
 * @external {LodashWrapper}
 * @see https://lodash.com/docs/#chain
 */

/**
 * Interface for the quote system.
 * The quote system is simpler than the karma system: a simple array of quotes
 * that can be fetched randomly or by ID.
 */
class QuoteManager {
  /**
   * Creates a new QuoteManager.
   */
  constructor (config, db) {
    // set class variables
    this.config = config
    // set defaults, if available
    db.defaults({
      quotes: config.defaults
    }).write()
    // only get the karma part of the db
    this.db = db.get('quotes')
  }
  /**
   * Gets a quote.
   * @param {number} id - ID of the quote to get.
   */
  get (id) {
    return this.db
      .nth(id)
      .value()
  }
  /**
   * Gets a random quote.
   */
  getRandom () {
    return this.db
      .sample()
      .value()
  }
  /**
   * Creates a new quote in the database.
   * @param {string} quote - The quote to add.
   */
  create (quote) {
    return this.db
      .push(quote)
      .write()
  }
}

module.exports = QuoteManager
