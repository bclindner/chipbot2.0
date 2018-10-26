/**
 * Simple command object.
 * A wrapper for a command function which allows a {@link CommandHandler}
 * to interface with it and run commands through it.
 */
class Command {
  /**
   * Create a new Command.
   * @param {RegExp} regex - Regular expression the command will test on.
   * If the contents of a message pass this regular expression, the command
   * will execute.
   */
  constructor(regex) {
    this.regex = regex
  }
  _run (msg) {
    if (this.regex.test(msg.content)) {
      this.run(msg)
    }
  }
  /**
   * Function the {@link CommandHandler} runs when the regex passes.
   */
  run () {
    return false
  }
}
module.exports = Command
