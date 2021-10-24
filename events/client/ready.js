module.exports = (Discord, client) => {
    console.log('Bot ready!')
    const c = client.user.setPresence({
        afk: false,
        activities: [{
            name: 'a$help',
            type: 'PLAYING'
        }],
        intents: [],
        partials: [],
    })
}