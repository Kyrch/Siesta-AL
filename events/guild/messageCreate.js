const {
    prefix
} = require('../../botconfig/config.json')

module.exports = (Discord, client, message) => {

    if (!message.content.startsWith(prefix)) return // || message.channel.type == "dm") return
    const args = message.content.slice(prefix.length).split(/ +/)
    const command_name = args.shift().toLowerCase()
    const command = client.commands.get(command_name) || client.commands.find(a => a.aliases && a.aliases.includes(command_name))
    if (command) command.execute(client, message, args, Discord)
}