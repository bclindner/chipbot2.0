// discord bot framework
const Discord = require('discord.js')
// database (for karma tracking)
const low = require('lowdb')
// local config file
const config = require('./config.json')

// configure the database
/// get the db object
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
/// set default database structure
db.defaults({
  subjects: {
    chiptune: 1000000,
    chiptunes: 1000000,
    otherm: Number.MIN_SAFE_INTEGER // heheheh
  }
}).write()

// configure the bot
const bot = new Discord.Client()

// log that we signed in
bot.on('ready', () => {
  console.log(`logged in as ${bot.user.tag}`)
})

// the karma system is functionally close to how IRC chipbot does it.
// a user can upvote or downvote a word by adding ++ or -- to the end,
// as usual, or use ~~ to check the ranking of a subject.
// at the back end, this recode uses a similar flat-file json database to
// store the rankings, but uses lowdb to handle the access in an ORM manner.
function karma (msg) {
  // use regex to determine if the message content matches the following format:
  // (1 or more alphanumeric characters)(++ or -- or ~~)
  const karmaRegex = /^[A-z0-9]+(\+\+|--|~~)$/g
  if (karmaRegex.test(msg.content)) {
    // isolate the subject being upvoted/downvoted and the symbol at the end
    let symbol = msg.content.slice(-2)
    let subject = msg.content.slice(0, -2).toLowerCase()
    let points
    if (subject === 'otherm' && symbol !== '~~') {
      // deny it, because downvoting other m again would literally cause an underflow
      msg.react('🛑') // stop sign emoji
    } else {
      // create karma subject in db if it does not exist
      if (!db.get('subjects').has(subject).value()) {
        db.get('subjects').set(subject, 0)
          .write()
      }

      // do something based on the symbol
      switch (symbol) {
        case '++': // upvote
          // commit upvote to database
          db.get('subjects')
            .update(subject, n => n + 1)
            .write()
          // get point value
          points = db.get('subjects').get(subject).value()
          // print point value
          msg.reply('upvote successful: ' + subject + ' now has ' + points + ' karma.')
          break
        case '--': // downvote
          // commit downvote to database
          db.get('subjects')
            .update(subject, n => n - 1)
            .write()
          // get point value
          points = db.get('subjects').get(subject).value()
          // print point value
          msg.reply('downvote successful: ' + subject + ' now has ' + points + ' karma.')
          break
        case '~~': // check
          // get point value
          points = db.get('subjects').get(subject).value()
          // print point value
          msg.reply(subject + ' has ' + points + ' karma.')
          break
        default: // in case of solar flares
          msg.reply('encountered an error with your query!')
      }
    }
  }
}
bot.on('message', karma)

bot.login(config.token)
