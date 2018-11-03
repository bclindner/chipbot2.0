/**
 * Simple command object.
 * A wrapper for a command function which allows a {@link CommandHandler}
 * to interface with it and run commands through it.
 */
class Command {
  /**
   * Function the {@link CommandHandler} runs to check if this command should execute.
   * @param msg - Message to test against.
   */
  test() {
    return false
  }
  /**
   * Function the {@link CommandHandler} runs when the regex passes.
   */
  run () {
    return false
  }
}
/**
 * Special Command object that accepts a regular expression to test with.
 */
class RegexCommand extends Command {
  /**
   * Create a new Command.
   * @param {RegExp} regex - Regular expression the command will test on.
   * If the contents of a message pass this regular expression, the command
   * will execute.
   */
  constructor(regex) {
    super()
    this.regex = regex
  }
  test(msg) {
    return this.regex.test(msg.content)
  }
}
module.exports = {
  Command: Command,
  RegexCommand: RegexCommand
}
