const fs = require('fs')
const RegexCommand = require('./Command').RegexCommand

class EmoteCommand extends RegexCommand {
  constructor (emotesFile) {
    super(/^.emote( [1-9][0-9]*)?$/g)
    this.emotesFile = emotesFile
  }
  run (msg) {
    // read the emotes file
    fs.readFile(this.emotesFile, 'utf8', (err, data) => {
      if (err) { throw err }
      // split the file into lines
      const file = data.split('\n')
      // if there is a second argument, it's an ID
      let line = ''
      if (msg.content.split(' ')[1]) {
        // get that ID
        line = msg.content.split(' ')[1] - 1
      } else {
        // otherwise just generate a random line number
        line = Math.floor(Math.random() * file.length)
      }
      // get the emote by line number
      const emote = file[line]
      // if there is an emote, send it
      if (emote) {
        msg.channel.send(emote)
      }
    })
  }
}

module.exports = EmoteCommand
