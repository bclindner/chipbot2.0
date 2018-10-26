const fs = require('fs')
const Command = require('./Command')

class EmoteCommand extends Command {
  constructor (emotesFile) {
    super(/^.emote( [1-9][0-9]*)?$/g)
    this.emotesFile = emotesFile
  }
  run (msg) {
    fs.readFile(this.emotesFile, 'utf8', (err, data) => {
      if (err) { throw err }
      const file = data.split('\n')
      let line = Math.floor(Math.random() * file.length)
      if (msg.content.split(' ')[1]) {
        line = msg.content.split(' ')[1] - 1
      }
      const randomEmote = file[line]
      if (randomEmote) {
        msg.channel.send(randomEmote)
      }
    })
  }
}

module.exports = EmoteCommand
