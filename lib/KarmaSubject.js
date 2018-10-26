/**
 * An interface for karma subjects.
 * @param {LodashWrapper} db - Database chain pointing to the subject in question.
 */
class KarmaSubject {
  constructor (db) {
    // keep our segment of the db in the object to reference in setters/getters
    this.db = db
  }
  /**
   * Whether or not the subject can be upvoted.
   * @type {boolean}
   */
  get canUpvote () {
    return this.db.get('canUpvote').value()
  }
  set canUpvote (value) {
    this.db
      .set({'canUpvote': value})
      .write()
  }
  /**
   * Whether or not the subject can be upvoted.
   * @type {boolean}
   */
  get canDownvote () {
    return this.db.get('canDownvote').value()
  }
  set canDownvote (value) {
    this.db
      .set({'canDownvote': value})
      .write()
  }
  /**
   * The name of the subject.
   * @type {string}
   */
  get name () {
    return this.db.get('name').value()
  }
  set name (value) {
    this.db
      .set({'name': value})
      .write()
  }
  /**
   * The point value of the subject.
   * @type {number}
   */
  get points () {
    return this.db.get('points').value()
  }
  set points (value) {
    this.db
      .set({'points': value})
      .write()
  }
  /**
   * Helper function that increases the points level by 1.
   * @returns {boolean} result - Success state of the operation.
   */
  upvote () {
    if (this.canUpvote) {
      this.db
        .update('points', n => n + 1)
        .write()
      return true
    } else {
      return false
    }
  }
  /**
   * Helper function that decreases the points level by 1.
   * @returns {boolean} result - Success state of the operation.
   */
  downvote () {
    if (this.canDownvote) {
      this.db
        .update('points', n => n - 1)
        .write()
      return true
    } else {
      return false
    }
  }
  /**
   * Whether or not a subject has lines for ridicule if a forbidden upvote/downvote is attempted.
   * @type {boolean}
   */
  get canRidicule () {
    return this.db.has('ridicule').value()
  }
  /**
   * Returns a random ridicule line from the subject's ridicule array, if available.
   * @returns {string}
   */
  getRandomRidicule () {
    if (this.canRidicule) {
      return this.db
        .get('ridicule')
        .sample()
        .value()
    } else {
      return null
    }
  }
}
module.exports = KarmaSubject
