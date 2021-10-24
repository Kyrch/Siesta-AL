const fs = require('fs')

module.exports = (client, Discord) => {
    const commandFiles = fs.readdirSync('./commands').filter(folder => folder.endsWith('.js'))
    for (const file of commandFiles) {
        const commands = require(`../commands/${file}`)
        if (commands.name) client.commands.set(commands.name, commands);
        else continue
    }
}