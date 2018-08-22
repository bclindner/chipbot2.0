class KarmaSubject {
  constructor (db) {
    // keep our segment of the db in the object to reference in setters/getters
    this.db = db
  }
  get canUpvote () {
    return this.db.get('canUpvote').value()
  }
  set canUpvote (value) {
    this.db
      .set({'canUpvote': value})
      .write()
  }

  get canDownvote () {
    return this.db.get('canDownvote').value()
  }
  set canDownvote (value) {
    this.db
      .set({'canDownvote': value})
      .write()
  }

  get name () {
    return this.db.get('name').value()
  }
  set name (value) {
    this.db
      .set({'name': value})
      .write()
  }

  get points () {
    return this.db.get('points').value()
  }
  set points (value) {
    this.db
      .set({'points': value})
      .write()
  }
  upvote () {
    this.db
      .update('points', n => n + 1)
      .write()
  }
  downvote () {
    this.db
      .update('points', n => n - 1)
      .write()
  }
  get canRidicule () {
    return this.db.has('ridicule').value()
  }
  getRandomRidicule () {
    return this.db
      .get('ridicule')
      .sample()
      .value()
  }
}
module.exports = KarmaSubject
