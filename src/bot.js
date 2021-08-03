const database = require('./database.js')

const setRegex = /^!=\s*(\d+)/
/**
 * @param { import('discord.js').Client } client
 */
module.exports = function onReadyFactory (client) {
  return function onReady () {
    console.log('bot startup')
    client.on('message', async function (message) {
      const {
        mentions,
        content = '',
        guild: { id: guildId }
      } = message
      mentions.users.forEach(async ({ id, username }) => {
        if (content.startsWith('!+')) {
          const { count } = await database.increment({
            guildId,
            username,
            userId: id
          })
          message.channel.send(
            `⬆️ ${username}: era ${count - 1}, agora é ${count}`
          )
        }
        if (content.startsWith('!-')) {
          const { count } = await database.decrement({
            guildId,
            username,
            userId: id
          })
          message.channel.send(
            `⬇️ ${username}: era ${count + 1}, agora é ${count}`
          )
        }
        if (setRegex.test(content)) {
          const [, quantity] = content.match(setRegex) ?? []
          const newScore = parseInt(quantity, 10)
          await database.set({
            guildId,
            username,
            userId: id,
            count: newScore
          })
          message.channel.send(`${username}: agora é ${newScore}`)
        }
      })

      if (content === '!>') {
        const result = await (await database.list({ guildId })).toArray()
        const msg = result.reduce(
          (msg, { username, count }) => `${msg}\n${username}: \`${count}\``,
          ''
        )
        message.channel.send(msg)
      }

      if (content === '!?') {
        message.reply(usage)
      }
    })
  }
}

const command = cmd => '`' + cmd + '`'
const usage = `
Comandos disponíveis
${command('!?')}: mostra os comandos disponíveis
${command('!>')}: Lista o score dos usuários neste server
${command(
  '!+ <@user> [...@users]'
)}: incrementa o score dos usuários mencionados
${command(
  '!- <@user> [...@users]'
)}: decrementa o score dos usuários mencionados
${command(
  '!= <score> <@user> [...@users]'
)}: configura o score dos usuários mencionados para <score>
`
