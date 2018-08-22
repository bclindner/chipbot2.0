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

// set up karma system
const KarmaManager = require('./lib/KarmaManager.js')
const karma = new KarmaManager(karmaConfig, db)

// set up the bot
const bot = new Discord.Client()

db.defaults({
  karma: karmaConfig.defaults
}).write()
// log that we signed in
bot.on('ready', () => {
  console.log(`logged in as ${bot.user.tag}`)
})

// karma module
function karmaVoting (msg) {
  // use regex to determine if the message content matches the following format:
  // (1 or more alphanumeric characters)(++ or -- or ~~)
  const regex = /^[A-z0-9]+(\+\+|--|~~)$/g
  if (regex.test(msg.content)) {
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
let maxSubjectsToGet = 10
function karmaRankings (msg) {
  // use regex to determine if the message content matches the following format:
  // .top <number from 0 to 100>
  const regex = /^\.(top|bottom) ([0-9]+)$/g
  if (regex.test(msg.content)) {
    let numOfSubjects = msg.content.split(' ')[1]
    let topOrBottom = (msg.content.split(' ')[0].slice(1))
    let resp = ''
    let subjects = []

    // test: is number of subjects going to potentially flood the server?
    if (numOfSubjects > maxSubjectsToGet) {
      // throw an error to the user and deny them
      msg.reply('can\'t list that many!')
      return
    }
    if (topOrBottom === 'top') {
      subjects = karma.getTop(numOfSubjects)
    } else if (topOrBottom === 'bottom') {
      subjects = karma.getBottom(numOfSubjects)
    } else {
      msg.react('⚠️') // warning sign - this shouldn't be possible
    }
    resp += 'the ' + topOrBottom + ' ' + subjects.length + ' subjects are:\n'
    for (let i = 0; i < subjects.length; i++) {
      resp += subjects[i].subject + ': ' + subjects[i].karma + '\n'
    }
    msg.reply(resp)
  }
}
bot.on('message', karmaVoting)
bot.on('message', karmaRankings)

bot.login(botConfig.token)
