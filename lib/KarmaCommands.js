const RegexCommand = require('./Command').RegexCommand
const KarmaManager = require('./KarmaManager.js')

const karmaConfig = require('../config/karma.json')

class KarmaVoting extends RegexCommand {
  constructor (db) {
    super(/^[A-z0-9]+(\+\+|--|~~)$/g)
    this.karma = new KarmaManager(karmaConfig, db)
    // set up karma system
  }
  run (msg) {
    // isolate the subject being upvoted/downvoted and the symbol at the end
    let symbol = msg.content.slice(-2) // symbol at the end (the ++/--/~~)
    let subjectName = msg.content.slice(0, -2).toLowerCase() // the subject, in all lowercase
    // get our subject object
    let subject = this.karma.get(subjectName)
    // determine what to do given the symbol
    switch (symbol) {
      case '++':
        if (subject.canUpvote) {
          subject.upvote()
          msg.reply('upvote successful: ' + subject.name + ' now has ' + subject.points + ' karma.')
        } else {
          // if there is ridicule, then ridicule them
          if (subject.canRidicule) {
            msg.reply(subject.getRandomRidicule())
          } else {
            // otherwise just get the generic line
            msg.reply('you can\'t upvote that!')
          }
        }
        break
      case '--':
        if (subject.canDownvote) {
          subject.downvote()
          msg.reply('downvote successful: ' + subject.name + ' now has ' + subject.points + ' karma.')
        } else {
          // if there is ridicule, then ridicule them
          if (subject.canRidicule) {
            msg.reply(subject.getRandomRidicule())
          } else {
            // otherwise just get the generic line
            msg.reply('you can\'t downvote that!')
          }
        }
        break
      case '~~':
        msg.reply(subject.name + ' has ' + subject.points + ' karma.')
        break
      default:
        break
    }
  }
}

class KarmaRankings extends RegexCommand {
  constructor (db, config = {}) {
    super(/^\.(top|bottom) ?[0-9]*$/g)
    this.karma = new KarmaManager(karmaConfig, db)
    if ('maxSubjectsToGet' in config) {
      this.maxSubjectsToGet = config.maxSubjectsToGet
    } else {
      this.maxSubjectsToGet = 10
    }
    if ('defaultSubjectsToGet' in config) {
      this.defaultSubjectsToGet = config.defaultSubjectsToGet
    } else {
      this.defaultSubjectsToGet = 5
    }
  }
  run (msg) {
    let numOfSubjects = msg.content.split(' ')[1]
    let topOrBottom = (msg.content.split(' ')[0].slice(1))
    let resp = ''
    let subjects = []
    // test: is number of subjects going to potentially flood the server?
    if (numOfSubjects > this.maxSubjectsToGet) {
      // throw an error to the user and deny them
      msg.reply('can\'t list that many!')
      return
    } else if (numOfSubjects === undefined) {
      numOfSubjects = this.defaultSubjectsToGet
    }
    if (topOrBottom === 'top') {
      subjects = this.karma.getTop(numOfSubjects)
    } else if (topOrBottom === 'bottom') {
      subjects = this.karma.getBottom(numOfSubjects)
    } else {
      msg.react('⚠️') // warning sign - this shouldn't be possible
    }
    resp += 'the ' + topOrBottom + ' ' + subjects.length + ' subjects are:\n'
    for (let i = 0; i < subjects.length; i++) {
      resp += subjects[i].name + ': ' + subjects[i].points + '\n'
    }
    msg.reply(resp)
  }
}

module.exports = {
  KarmaRankings: KarmaRankings,
  KarmaVoting: KarmaVoting
}
