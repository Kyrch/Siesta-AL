const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions
} = require('discord.js');
const ee = require('../botconfig/embed.json');

const list = new Set();

module.exports = {
    name: 'searchmanga',
    description: 'Procura mangá no anilist',
    aliases: ['sm'],
    async execute(client, message, args) {
        const config = require('../botconfig/config.json');
        const Discord = require('discord.js');
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

        if (args.length == 0) return message.channel.send('Syntax: a.searchmanga <mangá>')

        const search = await AniList.searchMedia({
            search: args.join(' ').toString(),
            format: 'MANGA',
            perPage: 5
        });

        if (search.Results.length == 0) {
            console.log('search indefinido')
            return
        }

        const status = {
            RELEASING: 'Casting',
            FINISHED: 'Finished',
            HIATUS: 'Hiatus',
            CANCELED: 'Canceled'
        }

        await sleep(300)
        message.reply('Loading...').then(async (resultMessage) => {

            const array = search.Results
            let i = 0
            array.forEach(async (e) => {
                const firstResult = search.Results
                let startDate = `${firstResult[i].info.startDate.day == null ? 'XX' : firstResult[i].info.startDate.day}/${firstResult[i].info.startDate.month == null ? 'XX' : firstResult[i].info.startDate.month}/${firstResult[i].info.startDate.year == null ? 'XX' : firstResult[i].info.startDate.year}`
                let endDate = `${firstResult[i].info.endDate.day == null ? 'XX' : firstResult[i].info.endDate.day}/${firstResult[i].info.endDate.month == null ? 'XX' : firstResult[i].info.endDate.month}/${firstResult[i].info.endDate.year == null ? 'XX' : firstResult[i].info.endDate.year}`

                let info = {
                    titleRomaji: firstResult[i].info.title.romaji.toString(),
                    titleEnglish: firstResult[i].info.title.english == null ? firstResult[i].info.title.romaji.toString() : firstResult[i].info.title.english.toString(),
                    url: firstResult[i].info.siteUrl.toString(),
                    image: firstResult[i].info.coverImage.extraLarge.toString(),
                    startDate: startDate,
                    endDate: endDate,
                    status: status[firstResult[i].info.status],
                    favorites: firstResult[i].info.favourites.toString(),
                    chapters: firstResult[i].info.chapters == null ? 'Undefined' : firstResult[i].info.chapters.toString(),
                    genres: firstResult[i].info.genres.length == 0 ? 'No Gender' : firstResult[i].info.genres.join(', ').toString(),
                    score: firstResult[i].info.meanScore == null ? 'No Score' : `${firstResult[i].info.meanScore}%`
                }
                i++
                list.add(info)
            });
            await sleep(500)
            let pe = Array.from(list);
            lisM(resultMessage, message, pe, 1, Discord, client)
            list.clear()
        })
    }
}

sleep = async msec => {
    return new Promise(resolve => setTimeout(resolve, msec));
}

lisM = async (listMsgM, message, pe, page, Discord, client) => {

    let titleRomaji = pe.slice(page - 1, page).map(a => a.titleRomaji)
    let titleEnglish = pe.slice(page - 1, page).map(a => a.titleEnglish)
    let url = pe.slice(page - 1, page).map(a => a.url)
    let image = pe.slice(page - 1, page).map(a => a.image)
    let startDate = pe.slice(page - 1, page).map(a => a.startDate)
    let endDate = pe.slice(page - 1, page).map(a => a.endDate)
    let status = pe.slice(page - 1, page).map(a => a.status)
    let favorites = pe.slice(page - 1, page).map(a => a.favorites)
    let chapters = pe.slice(page - 1, page).map(a => a.chapters)
    let genres = pe.slice(page - 1, page).map(a => a.genres)
    let score = pe.slice(page - 1, page).map(a => a.score)


    let embed = new MessageEmbed()
        .setColor(ee.colorManga)
        .setTitle(`${titleRomaji}`)
        .setDescription(`[${titleEnglish.toString()}](${url.toString()})` + '\n' + `Page ${page}/${pe.length}`)
        .setTimestamp()
        .setFooter(ee.footerText, ee.footerIcon)


    embed.addField('Chapters', `${chapters}`, true)
    embed.addField('Genres', `${genres}`)
    embed.addField('StartDate', `${startDate}`, true)
    embed.addField('EndDate', `${endDate}`, true)
    embed.addField('Status', `${status}`, true)
    embed.addField('Favorites', `${favorites}`, true)
    embed.addField('MeanScore', `${score}`, true)
    embed.setImage(`${image.toString()}`)
    embed.setThumbnail(`${image.toString()}`)

    const row = new MessageActionRow().addComponents(
        new MessageButton()
        .setCustomId('back')
        .setEmoji('◀️')
        .setStyle('PRIMARY'),
        new MessageButton()
        .setCustomId('next')
        .setEmoji('▶️')
        .setStyle('PRIMARY')
    )

    if (page != 1) {
        row.addComponents(
            new MessageButton()
            .setCustomId('fback')
            .setEmoji('⏪')
            .setStyle('PRIMARY')
        )
    }

    if (pe.length > page) {
        row.addComponents(
            new MessageButton()
            .setCustomId('fnext')
            .setEmoji('⏩')
            .setStyle('PRIMARY')
        )
    }

    if (listMsgM) await listMsgM.edit({
        embeds: [embed],
        components: [row]
    })
    else listMsgM = await message.channel.send({
        embeds: [embed],
        components: [row]
    });

    if (client != undefined) {
        client.on('interactionCreate', interaction => {
            if (!interaction.isButton()) return;
            if (interaction.customId == 'back') {
                if (page == 1) lisM(listMsgM, message, pe, pe.length, Discord)
                else lisM(listMsgM, message, pe, page - 1, Discord)
                page--
            }

            if (interaction.customId == 'next') {
                if (page == pe.length) lisM(listMsgM, message, pe, 1, Discord)
                else lisM(listMsgM, message, pe, page + 1, Discord)
                page++
            }

            if (interaction.customId == 'fback') {
                lisM(listMsgM, message, pe, 1, Discord)
                page = 1
            }

            if (interaction.customId == 'fnext') {
                lisM(listMsgM, message, pe, pe.length, Discord)
                page = pe.length
            }
        });
    }
}