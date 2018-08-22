class KarmaSubject {
  constructor (db) {
    // keep our segment of the db in the object to reference in setters/getters
    this.db = db
  }
  /**
   * Determines if this subject can be upvoted.
   * @returns {boolean}
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
   * Determines if this subject can be downvoted.
   * @returns {boolean}
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
   * Gets the name of the subject.
   * @returns {string}
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
   * Gets the point value of the subject.
   * @returns {number}
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
    if (this.canDownvote) {
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
   * Checks if a subject has lines for ridicule if a forbidden upvote/downvote is attempted.
   * @return {boolean}
   */
  get canRidicule () {
    return this.db.has('ridicule').value()
  }
  /**
   * Returns a random ridicule line from the subject's array, if available.
   * @returns {string}
   */
  getRandomRidicule () {
    return this.db
      .get('ridicule')
      .sample()
      .value()
  }
}
module.exports = KarmaSubject
