const {
    MessageEmbed,
    Permissions,
    MessageActionRow,
    MessageButton
} = require("discord.js");

const ee = require('../botconfig/embed.json');
const config = require('../botconfig/config.json');

module.exports = {
    name: 'help',
    description: 'Comando de ajuda',
    execute(client, message, args) {

        const {
            member
        } = message

        const adm = Permissions.FLAGS.ADMINISTRATOR
        const msg = Permissions.FLAGS.SEND_MESSAGES
        const embedLink = Permissions.FLAGS.EMBED_LINKS

        const messageConsole = `${message.author.username}#${message.author.discriminator}`

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setLabel('Twitter')
                .setEmoji('<:twitter:890273048148705280>')
                .setStyle('LINK')
                .setURL('https://twitter.com/Kyrchzera'),
                new MessageButton()
                .setLabel('Invite Bot')
                .setEmoji('🤖')
                .setStyle('LINK')
                .setURL('https://discord.com/api/oauth2/authorize?client_id=888826907536261170&permissions=8&scope=bot%20applications.commands'),
                new MessageButton()
                .setLabel('Donate')
                .setEmoji('<:picpayicon:890452619825389598>')
                .setStyle('LINK')
                .setURL('https://app.picpay.com/user/kyrch')
            )

        const prefix = config.prefix;
        const user = message.author;
        const avatarVerify = user.avatarURL({
            dynamic: true,
            format: "png",
            size: 1024
        });

        if (avatarVerify === null) {
            var avatar = "https://i.imgur.com/Xlm8eDA.png"
        } else {
            var avatar = avatarVerify
        }

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

        if (args.length == 0) {

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle('LIST OF COMMANDS')
                .setAuthor(`${user.username}#${user.discriminator}`, avatar)
                .setThumbnail(ee.avatar)
                .addFields({
                    name: 'COMMAND HELP',
                    value: `${prefix}help <command>`
                }, {
                    name: 'Commands',
                    value: 'searchanime \n searchmanga \n searchcharacter \n searchuser'
                })
                .setTimestamp()
                .setFooter(ee.footerText, ee.footerIcon)

            message.channel.send({
                embeds: [embed],
                components: [row]
            })
            return
        }

        const nameCmd = args[0].toLowerCase()

        if (nameCmd == 'searchanime') {

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle('COMMAND SEARCHANIME')
                .setAuthor(`${user.username}#${user.discriminator}`, avatar)
                .setThumbnail(ee.avatar)
                .addFields({
                    name: 'Syntax',
                    value: `${prefix}searchanime <anime>`
                }, {
                    name: 'Aliases',
                    value: `${prefix}sa`
                }, {
                    name: 'Function',
                    value: 'Search anime on Anilist'
                }, {
                    name: 'Required Permissions',
                    value: 'None'
                })
                .setTimestamp()
                .setFooter(ee.footerText, ee.footerIcon)

            message.channel.send({
                embeds: [embed],
                components: [row]
            })
        }

        if (nameCmd == 'searchmanga') {

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle('COMMAND SEARCHMANGA')
                .setAuthor(`${user.username}#${user.discriminator}`, avatar)
                .setThumbnail(ee.avatar)
                .addFields({
                    name: 'Syntax',
                    value: `${prefix}searchmanga <manga>`
                }, {
                    name: 'Aliases',
                    value: `${prefix}sm`
                }, {
                    name: 'Function',
                    value: 'Search manga on Anilist'
                }, {
                    name: 'Required Permissions',
                    value: 'None'
                })
                .setTimestamp()
                .setFooter(ee.footerText, ee.footerIcon)

            message.channel.send({
                embeds: [embed],
                components: [row]
            })
        }

        if (nameCmd == 'searchcharacter') {

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle('COMMAND SEARCHCHARACTER')
                .setAuthor(`${user.username}#${user.discriminator}`, avatar)
                .setThumbnail(ee.avatar)
                .addFields({
                    name: 'Syntax',
                    value: `${prefix}searchcharacter <character>`
                }, {
                    name: 'Aliases',
                    value: `${prefix}sc`
                }, {
                    name: 'Function',
                    value: 'Search character on Anilist'
                }, {
                    name: 'Required Permissions',
                    value: 'None'
                })
                .setTimestamp()
                .setFooter(ee.footerText, ee.footerIcon)

            message.channel.send({
                embeds: [embed],
                components: [row]
            })
        }

        if (nameCmd == 'searchuser') {

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setTitle('COMMAND SEARCHUSER')
                .setAuthor(`${user.username}#${user.discriminator}`, avatar)
                .setThumbnail(ee.avatar)
                .addFields({
                    name: 'Syntax',
                    value: `${prefix}searchuser <user>`
                }, {
                    name: 'Aliases',
                    value: `${prefix}sc`
                }, {
                    name: 'Function',
                    value: 'Search user on Anilist'
                }, {
                    name: 'Required Permissions',
                    value: 'None'
                })
                .setTimestamp()
                .setFooter(ee.footerText, ee.footerIcon)

            message.channel.send({
                embeds: [embed],
                components: [row]
            })
        }
    }
}