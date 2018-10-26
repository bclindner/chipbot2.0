class QuoteManager {
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
  get (id) {
    return this.db
      .nth(id)
      .value()
  }
  getRandom () {
    return this.db
      .sample()
      .value()
  }
  create (quote) {
    return this.db
      .push(quote)
      .write()
  }
}

module.exports = QuoteManager
