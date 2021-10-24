const {
    Client,
    Intents,
    Collection
} = require('discord.js');
const config = require('./botconfig/config.json');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS]
});
const Discord = require('discord.js');


client.commands = new Collection();
client.events = new Collection();

['command_handler', 'event_handler'].forEach(handler => require(`./handlers/${handler}`)(client, Discord))


client.login(config.token)