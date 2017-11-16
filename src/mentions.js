const Promise = require('bluebird')

module.exports = function MentionsFactory(db) {
    return {
        collection() {
            return db.then(db => db.collection('mentions'))
        },
        insertMention({mentionerId, mentionedId}) {
            return this.collection().then(mentions => {
                const insertOne = Promise.promisify(mentions.insertOne.bind(mentions))
                return insertOne({
                    mentioned: mentionedId,
                    mentioner: mentionerId,
                    timestamp: +new Date()
                })
            })
        },
        findMentionsTo(userId) {
            return this.collection().then(mentions => {
                return mentions.find({
                    mentioned: userId
                })
            })
        },
        findMentionsBy(userId) {
            return this.collection().then(mentions => {
                return mentions.find({
                    mentioner: userId
                })
            })
        }
    }
}
