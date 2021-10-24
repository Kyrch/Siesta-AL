const {
    MessageEmbed,
    Permissions
} = require('discord.js');
const ee = require('../botconfig/embed.json');

module.exports = {
    name: 'searchcharacter',
    description: 'ss',
    aliases: ['sc'],
    async execute(client, message, args) {
        const config = require('../botconfig/config.json');
        const Al = require('anilist.js');
        const AniList = new Al.Client(config.tokenAnilist);

        const {
            member
        } = message

        const adm = Permissions.FLAGS.ADMINISTRATOR
        const msg = Permissions.FLAGS.SEND_MESSAGES
        const embedLink = Permissions.FLAGS.EMBED_LINKS

        if (member.guild.me.permissions.has(adm) || member.guild.me.permissions.has(msg) || message.guild.me.permissionsIn(message.channel).has(msg)) {
            if (member.guild.me.permissions.has(adm) || message.guild.me.permissionsIn(message.channel).has(msg) != false) {

            } else {
                console.log(`${messageConsole} - Server: Sem ADM / Canal: Sem SEND_MESSAGES`)
                return
            }
        } else {
            console.log(`${messageConsole} // SEND_MESSAGES não está habilitado ao cargo nem ao canal. Sem ADMINISTRATOR`)
            return
        }

        if (member.guild.me.permissions.has(adm) || member.guild.me.permissions.has(embedLink) || message.guild.me.permissionsIn(message.channel).has(embedLink)) {
            if (member.guild.me.permissions.has(adm) || message.guild.me.permissionsIn(message.channel).has(embedLink) != false) {

            } else {
                console.log(`${messageConsole} - Server: Sem ADM / Canal: EMBED_LINKS`)
                return
            }
        } else {
            console.log(`${messageConsole} // EMBED_LINKS não está habilitado ao cargo nem ao canal. Sem ADMINISTRATOR`)
            return
        }

        if (args.length == 0) return message.channel.send('Syntax: a.searchcharacter <character>')

        const search = await AniList.searchCharacters({
            search: args.join(' ').toString(),
            perPage: 1
        });

        if (search.Results.length == 0) {
            console.log('search indefinido')
            return
        }

        let name = search.Results[0].info.name
        let url = search.Results[0].info.siteUrl
        let image = search.Results[0].info.image
        let numFav = search.Results[0].info.favourites

        let embed = new MessageEmbed()
            .setColor(ee.colorCharacter)
            .setDescription(`[${name.full}](${url})`)
            .setImage(`${image.large}`)
            .addFields({
                name: 'Favorites',
                value: `${numFav}`
            })
            .setTimestamp()
            .setFooter(ee.footerText, ee.footerIcon)

        if (search.Results[0].info.description != null) {
            let desc = search.Results[0].info.description.split('\n\n')[0]
            embed.addField('Description', desc)
        }

        message.channel.send({
            embeds: [embed]
        })
    }
}