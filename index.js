// import libraries
const Discord = require('discord.js') // discord bot framework

// import local config files
const botConfig = require('./config/bot.json')

// set up the bot
const bot = new Discord.Client()

const CommandHandler = require('./lib/CommandHandler')
const KarmaVoting = require('./lib/KarmaCommands').KarmaVoting
const KarmaRankings = require('./lib/KarmaCommands').KarmaRankings

const handler = new CommandHandler(bot)
handler.register(new KarmaVoting())
handler.register(new KarmaRankings())

// log that we signed in
bot.on('ready', () => {
  console.log(`logged in as ${bot.user.tag}`)
})

// now that commands have been defined, get the bot config
bot.login(botConfig.token)
