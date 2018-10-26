const Command = require('./Command')
const QuoteManager = require('./QuoteManager')

const quoteConfig = require('../config/quotes.json')

class GetQuote extends Command {
  constructor (db) {
    super(/^.quote( [1-9][0-9]*)?$/g)
    this.quotes = new QuoteManager(quoteConfig, db)
  }
  run (msg) {
    let quote = ''
    if (msg.content.split(' ').length > 1) {
      const id = msg.content.split(' ')[1] - 1
      quote = this.quotes.get(id)
    } else {
      quote = this.quotes.getRandom()
    }
    if (quote) {
      msg.channel.send(quote)
    }
  }
}

class AddQuote extends Command {
  constructor (db) {
    super(/^.addquote .+$/g)
    this.quotes = new QuoteManager(quoteConfig, db)
  }
  run (msg) {
    const quote = msg.content.substring(10)
    this.quotes.create(quote)
    msg.channel.send('Quote added!')
  }
}

module.exports = {
  GetQuote: GetQuote,
  AddQuote: AddQuote
}
