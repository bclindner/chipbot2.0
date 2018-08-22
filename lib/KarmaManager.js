/**
 * @external {LodashWrapper}
 * @see https://lodash.com/docs/#chain
 */

/**
 * Interface for the karma ranking system.
 * The karma ranking system is relatively simple, and takes up the `karma`
 * key in the root of the database provided. All of the entries inside that
 * key are set up as follows:
 * <pre><code>
 * {
 *   "subject": {
 *     "karma": 0,
 *     "canUpvote": true
 *     "canDownvote": true
 *   }
 * }
 * </code></pre>
 */
class KarmaManager {
  /**
   * Create a new Karma manager, hooking into an existing lowdb database connection.
   * @param {object} config - A configuration for the karma manager.
   * @param {LodashWrapper} db - A lowdb database connection.
   */
  constructor (config, db) {
    // set class variables
    this.config = config
    // set defaults, if available
    db.defaults({
      karma: config.defaults
    }).write()
    // only get the karma part of the db
    this.db = db.get('karma')
  }
  /**
   * Upvote a subject.
   * @param {string} subject - The subject to upvote.
   * @return {boolean} Success state of the upvote. This will always be true unless an error is thrown.
   */
  upvote (subject) {
    // sanity check: can the number (safely) go higher?
    if (this.check(subject) + 1 > Number.MAX_SAFE_INTEGER) {
      throw new Error("Subject can't go any higher!")
    } else {
      this.db
        .find({'subject': subject})
        .update('karma', n => n + 1)
        .write()
      return true
    }
  }
  /**
   * Downvote a subject.
   * @param {string} subject - The subject to downvote.
   * @return {boolean} Success state of the downvote.
   */
  downvote (subject) {
    // sanity check: can the number (safely) go lower?
    if (this.check(subject) - 1 < Number.MIN_SAFE_INTEGER) {
      throw new Error("Subject can't go any lower!")
    } else {
      this.db
        .find({'subject': subject})
        .update('karma', n => n - 1)
        .write()
      return true
    }
  }
  /**
   * Check the amount of karma a subject has.
   * @param {string} subject - The subject to check.
   * @return {number} The subject's karma.
   */
  check (subject) {
    // get the value
    return this.db
      .find({'subject': subject})
      .get('karma')
      .value()
  }
  /**
   * Simple helper function to check if a subject exists in the karma database.
   * @param {string} subject - The subject to check.
   * @return {boolean} Whether or not the subject exists.
   */
  exists (subject) {
    return this.db.find({'subject': subject}).value()
  }
  /**
   * Create a subject and set its karma to 0, if it does not exist.
   * @param {string} subject - The subject to check.
   * @return {boolean} Whether or not the object was created. If false, the object already existed.
   */
  create (subject) {
    if (!this.exists(subject)) { // don't create subject if it already exists
      this.db
        .push({
          'subject': subject,
          'karma': 0,
          'canUpvote': true,
          'canDownvote': true
        })
        .write()
      return true
    } else {
      return false
    }
  }
  /**
   * Get a listing of the highest-rated karma subjects.
   * @param {number} NumOfSubjects - The number of subjects to get.
   * @return {object} The list of karma subjects.
   */
  getTop (numOfSubjects) {
    return this.db
      .orderBy('karma', 'desc')
      .take(numOfSubjects)
      .value()
  }
  /**
   * Get a listing of the lowest-rated karma subjects.
   * @param {number} NumOfSubjects - The number of subjects to get.
   * @return {object} The list of karma subjects.
   */
  getBottom (numOfSubjects) {
    return this.db
      .orderBy('karma', 'asc')
      .take(numOfSubjects)
      .value()
  }
}
module.exports = KarmaManager
