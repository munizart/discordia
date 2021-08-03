const Discord = require('discord.js')
const bot = require('./src/bot')
const { connect } = require('./src/database')

const client = new Discord.Client()
client.on('ready', bot(client))

connect().then(() => {
  client.login('secret')
})
