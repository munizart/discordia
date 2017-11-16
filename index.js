const Discord = require('discord.js')
const bot = require('./src/bot');

const client = new Discord.Client()

client.login('uh, chavoso, meia na canela')

client.on('ready', bot(client));
