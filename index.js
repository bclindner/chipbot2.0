// import libraries
const Discord = require('discord.js') // discord bot framework
const low = require('lowdb') // JSON db system

// import local config files
const botConfig = require('./config/bot.json')
const karmaConfig = require('./config/karma.json')

// set up the json database (required for karma system)
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json')
const db = low(adapter)

// create the db structure if it doesn't exist
db.defaults({
  karma: karmaConfig.defaults
}).write()

// set up karma system
const KarmaManager = require('./lib/karma.js')
const karma = new KarmaManager(karmaConfig, db)

// set up the bot
const bot = new Discord.Client()

// log that we signed in
bot.on('ready', () => {
  console.log(`logged in as ${bot.user.tag}`)
})

// karma module
function handleKarma (msg) {
  // use regex to determine if the message content matches the following format:
  // (1 or more alphanumeric characters)(++ or -- or ~~)
  const karmaRegex = /^[A-z0-9]+(\+\+|--|~~)$/g
  if (karmaRegex.test(msg.content)) {
    // isolate the subject being upvoted/downvoted and the symbol at the end
    let symbol = msg.content.slice(-2) // symbol at the end (the ++/--/~~)
    let subject = msg.content.slice(0, -2).toLowerCase() // the subject, in all lowercase
    let points // this variable will hold our points for reply later
    // if the subject does not exist, create it
    karma.create(subject)
    // determine what to do given the symbol
    switch (symbol) {
      case '++':
        if (karma.upvote(subject)) {
          points = karma.check(subject)
        }
        msg.reply('upvote successful: ' + subject + ' now has ' + points + ' karma.')
        break
      case '--':
        if (karma.downvote(subject)) {
          points = karma.check(subject)
        }
        msg.reply('downvote successful: ' + subject + ' now has ' + points + ' karma.')
        break
      case '~~':
        points = karma.check(subject)
        msg.reply(subject + ' has ' + karma.check(subject) + ' karma.')
        break
      default:
        break
    }
  }
}
bot.on('message', handleKarma)

bot.login(botConfig.token)
