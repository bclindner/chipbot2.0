class Command {
  constructor(regex) {
    this.regex = regex
  }
  _run (msg) {
    if (this.regex.test(msg.content)) {
      this.run(msg)
    }
  }
  run () {
    return false
  }
}
module.exports = Command
