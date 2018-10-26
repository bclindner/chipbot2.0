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
    // if there is a second argument, it's an ID
    if (msg.content.split(' ').length > 1) {
      // get the quote from this ID
      const id = msg.content.split(' ')[1] - 1
      quote = this.quotes.get(id)
    } else {
      // if there is no second argument, just get a random one
      quote = this.quotes.getRandom()
    }
    // send it out
    // if statement is to catch any empty quotes
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
    // trim the '.addquote '
    const quote = msg.content.substring(10)
    // create a new quote in the db
    this.quotes.create(quote)
    // notify the user
    msg.channel.send('Quote added!')
  }
}

module.exports = {
  GetQuote: GetQuote,
  AddQuote: AddQuote
}
