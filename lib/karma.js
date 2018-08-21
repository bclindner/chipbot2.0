
class KarmaManager {
  constructor (config, db) {
    // set up the lowdb database
    // set defaults, if available
    this.config = config
    this.db = db.get('karma') // only get the karma part of the db
    console.log(config.defaults)
    this.db.defaults(config.defaults).write()
    // set some helper variables
    this.subjects = this.db.get('subjects')
    this.blacklist = this.db.get('blacklist')
  }

  upvote (subject) {
    // sanity check: can the number (safely) go higher?
    if (this.check(subject) + 1 > Number.MAX_SAFE_INTEGER) {
      throw new Error("Subject can't go any higher!")
    } else {
      this.subjects
        .update(subject, n => n + 1)
        .write()
      return true
    }
  }

  downvote (subject) {
    // sanity check: can the number (safely) go lower?
    if (this.check(subject) - 1 < Number.MIN_SAFE_INTEGER) {
      throw new Error("Subject can't go any lower!")
    } else {
      this.subjects
        .update(subject, n => n - 1)
        .write()
      return true
    }
  }

  check (subject) {
    // get the value
    return this.subjects.get(subject).value()
  }

  exists (subject) {
    return this.subjects.has(subject).value()
  }

  create (subject) {
    if (!this.exists(subject)) { // don't create subject if it already exists
      this.subjects.set(subject, 0)
        .write()
      return true
    } else {
      return false
    }
  }
}

// define module export
module.exports = KarmaManager
