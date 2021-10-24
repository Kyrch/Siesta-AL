const {
    MessageEmbed,
    MessageActionRow,
    MessageButton,
    Permissions
} = require('discord.js');
const ee = require('../botconfig/embed.json');

const listA = new Set();

module.exports = {
    name: 'searchanime',
    description: 'Procura animes no anilist',
    aliases: ['sa'],
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


        if (args.length == 0) return message.channel.send('Syntax: a.searchanime <anime>')

        const search = await AniList.searchMedia({
            search: args.join(' ').toString(),
            format: 'TV',
            perPage: 5,
            sort: 'POPULARITY_DESC'
        });

        if (search.Results.length == 0) {
            console.log('search indefinido')
            return
        }

        const seasonDefault = {
            WINTER: 'Winter',
            SPRING: 'Spring',
            SUMMER: 'Summer',
            FALL: 'Fall'
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
                    season: firstResult[i].info.season == null ? 'No season' : seasonDefault[firstResult[i].info.season],
                    favorites: firstResult[i].info.favourites.toString(),
                    episodes: firstResult[i].info.episodes == null ? 'Undefined' : firstResult[i].info.episodes.toString(),
                    duration: firstResult[i].info.duration == null ? 'Undefined' : firstResult[i].info.duration.toString(),
                    genres: firstResult[i].info.genres.length == 0 ? 'No Gender' : firstResult[i].info.genres.join(', ').toString(),
                    score: firstResult[i].info.meanScore == null ? 'No Score' : `${firstResult[i].info.meanScore}%`
                }
                i++
                listA.add(info)
            });
            await sleep(500)
            let pe = Array.from(listA);
            lis(resultMessage, message, pe, 1, Discord, client)
            listA.clear()
        })
    }
}

sleep = async msec => {
    return new Promise(resolve => setTimeout(resolve, msec));
}

lis = async (listMsg, message, pe, page, Discord, client) => {

    let titleRomaji = pe.slice(page - 1, page).map(a => a.titleRomaji)
    let titleEnglish = pe.slice(page - 1, page).map(a => a.titleEnglish)
    let url = pe.slice(page - 1, page).map(a => a.url)
    let image = pe.slice(page - 1, page).map(a => a.image)
    let startDate = pe.slice(page - 1, page).map(a => a.startDate)
    let endDate = pe.slice(page - 1, page).map(a => a.endDate)
    let season = pe.slice(page - 1, page).map(a => a.season)
    let favorites = pe.slice(page - 1, page).map(a => a.favorites)
    let episodes = pe.slice(page - 1, page).map(a => a.episodes)
    let duration = pe.slice(page - 1, page).map(a => a.duration)
    let genres = pe.slice(page - 1, page).map(a => a.genres)
    let score = pe.slice(page - 1, page).map(a => a.score)


    let embed = new MessageEmbed()
        .setColor(ee.colorAnime)
        .setTitle(`${titleRomaji}`)
        .setDescription(`[${titleEnglish.toString()}](${url.toString()})` + '\n' + `Page ${page}/${pe.length}`)
        .setTimestamp()
        .setFooter(ee.footerText, ee.footerIcon)


    embed.addField('Episodes', `${episodes}`, true)
    embed.addField('Duration', `${duration}`, true)
    embed.addField('Genres', `${genres}`)
    embed.addField('StartDate', `${startDate}`, true)
    embed.addField('EndDate', `${endDate}`, true)
    embed.addField('Season', `${season}`, true)
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

    if (listMsg) await listMsg.edit({
        embeds: [embed],
        components: [row]
    })
    else listMsg = await message.channel.send({
        embeds: [embed],
        components: [row]
    });

    if (client != undefined) {
        client.on('interactionCreate', interaction => {
            if (!interaction.isButton()) return;
            if (interaction.customId == 'back') {
                if (page == 1) lis(listMsg, message, pe, pe.length, Discord)
                else lis(listMsg, message, pe, page - 1, Discord)
                page--
            }

            if (interaction.customId == 'next') {
                if (page == pe.length) lis(listMsg, message, pe, 1, Discord)
                else lis(listMsg, message, pe, page + 1, Discord)
                page++
            }

            if (interaction.customId == 'fback') {
                lis(listMsg, message, pe, 1, Discord)
                page = 1
            }

            if (interaction.customId == 'fnext') {
                lis(listMsg, message, pe, pe.length, Discord)
                page = pe.length
            }
        });
    }
}