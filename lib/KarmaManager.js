const KarmaSubject = require('./KarmaSubject')
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
 *   {
 *     "name": "subjectName"
 *     "points": 0,
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
  get (subjectName) {
    this.create(subjectName)
    return new KarmaSubject(this.db.find({'name': subjectName}))
  }
  /**
   * Simple helper function to check if a subject exists in the karma database.
   * @param {string} subject - The subject to check.
   * @return {boolean} Whether or not the subject exists.
   */
  exists (subjectName) {
    return this.db.find({'name': subjectName}).value()
  }
  /**
   * Create a subject and set its karma to 0, if it does not exist.
   * @param {string} subject - The subject to check.
   * @return {boolean} Whether or not the object was created. If false, the object already existed.
   */
  create (subjectName) {
    if (!this.exists(subjectName)) { // don't create subject if it already exists
      this.db
        .push({
          'name': subjectName,
          'points': 0,
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
      .orderBy('points', 'desc')
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
      .orderBy('points', 'asc')
      .take(numOfSubjects)
      .value()
  }
}
module.exports = KarmaManager
