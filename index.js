// import libraries
const Discord = require('discord.js') // discord bot framework
const low = require('lowdb') // local JSON flat-file database
const path = require('path') // for passing absolute paths to commands
// set up the json database (required for karma system)
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./db.json')
const db = low(adapter)

// import local config files
const botConfig = require('./config/bot.json')

// set up the bot
const bot = new Discord.Client()

const CommandHandler = require('./lib/CommandHandler')
const KarmaVoting = require('./lib/KarmaCommands').KarmaVoting
const KarmaRankings = require('./lib/KarmaCommands').KarmaRankings
const Emotes = require('./lib/EmoteCommand')

const handler = new CommandHandler(bot)
handler.register(new KarmaVoting(db))
handler.register(new KarmaRankings(db))
handler.register(new Emotes(path.resolve('./config/emotes')))

// log that we signed in
bot.on('ready', () => {
  console.log(`logged in as ${bot.user.tag}`)
})

// now that commands have been defined, get the bot config
bot.login(botConfig.token)
