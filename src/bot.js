const Mentions = require('./mentions')

const mentionRegexp = /<@(\d+)>/
const karmaRegexp = /<@(\d+)>\+\+/
const dieRegexp = /DIE!/

module.exports = function onReadyFactory(client){
    return function onReady(){
        console.log('bot startup')
        client.on('message', function(message) {
            const {content, author} = message

            if (karmaRegexp.test(content)) {
                message.reply('Karma added!')
            }

            if (dieRegexp.test(content)) {
                console.log('you shoot me dead')
                client.destroy()
                process.exit(1)
            }

            if (mentionRegexp.test(content)) {
                let [, mentionedId] = content.match(mentionRegexp)
                let mentionerId = author.id
            }

            console.log(`[${author.username}]: ${content}`)
        })
    }
}
