const mongo = require('mongodb')
const mongoClient = mongo.MongoClient

/** @type { mongo.Db } */
let db
module.exports = {
  async connect () {
    const conn = await mongoClient.connect('mongodb://localhost')
    db = conn.db('discordia')
    return db
  },
  async increment ({ username, guildId, userId }) {
    await db.collection(`scores[${guildId}]`).updateOne(
      {
        userId
      },
      {
        $set: {
          username
        },
        $inc: {
          count: 1
        }
      },
      {
        upsert: true
      }
    )
    return await db.collection(`scores[${guildId}]`).findOne({
      userId
    })
  },
  async decrement ({ username, guildId, userId }) {
    await db.collection(`scores[${guildId}]`).updateOne(
      {
        userId
      },
      {
        $set: {
          username
        },
        $inc: {
          count: -1
        }
      },
      {
        upsert: true
      }
    )
    return await db.collection(`scores[${guildId}]`).findOne({
      userId
    })
  },
  async set ({ username, guildId, userId, count }) {
    await db.collection(`scores[${guildId}]`).updateOne(
      {
        userId
      },
      {
        $set: {
          username,
          count
        }
      },
      {
        upsert: true
      }
    )
  },
  async list ({ guildId }) {
    return await db.collection(`scores[${guildId}]`).find({})
  }
}
