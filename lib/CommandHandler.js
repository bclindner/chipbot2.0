/**
 * @external {DiscordClient}
 * @see https://discord.js.org/#/docs/main/stable/class/Client
 */
/**
 * @external {DiscordMessage}
 * @see https://discord.js.org/#/docs/main/stable/class/Message
 */
/**
 * Command handler.
 * Holds a list of {@link Command} objects which it runs against the bot whenever a message is received.
 */
class CommandHandler {
  /**
   * Creates a new CommandHandler.
   * @param {object} config - a configuration for the karma manager.
   * @param {DiscordClient} bot - a Discord.js Client to test commands on.
   */
  constructor (bot) {
    this.bot = bot
    this.commands = []
    bot.on('message', (msg) => (
      this.handle(msg)
    ))
  }
  /**
   * Register a command with the handler.
   * @param {Command} cmd - A {@link Command} to register with the bot.
   */
  register (cmd) {
    this.commands.push(cmd)
  }
  /**
   * Handles an incoming message. Should probably not be called manually.
   * @param {DiscordMessage} msg - The Discord message to handle.
   */
  handle (msg) {
    for (let i in this.commands) {
      this.commands[i]._run(msg)
    }
  }
}

module.exports = CommandHandler
