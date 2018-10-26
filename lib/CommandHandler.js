class CommandHandler {
  constructor (bot) {
    this.bot = bot
    this.commands = []
    bot.on('message', (msg) => (
      this.handle(msg)
    ))
  }
  /**
   * Register a command with the handler.
   */
  register (command) {
    let cmd = new command()
    this.commands.push(cmd)
  }
  /**
   * Handles an incoming message.
   */
  handle (msg) {
    for (let i in this.commands) {
      this.commands[i]._run(msg)
    }
  }
}

module.exports = CommandHandler
