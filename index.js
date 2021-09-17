const express = require('express')
const app = express();
const port = 7000
app.get('/', (req, res) => res.send('MODMAIL SYSTEM IS WORKING PROPERLY !'))
app.listen(port, () =>
console.log(`READY TO GET MAIL'S FROM MEMBERS ! :D`));
const discord = require("discord.js");
const client = new discord.Client()
const { token, prefix, ServerID } = require("./config.json")

client.on('ready', () => {
    console.log(`${client.user.username} IS WORKING 24/7 !`)
    console.log(`ITS SHOWTIME ON DISCORD`)
  setInterval(async () => {
  const statuses = [`WATCHING DM FOR ANY MESSAGES !`, `DEVELOPED BY </CRYSTAL HQ> !`]
     client.user.setActivity(statuses[Math.floor(Math.random() * statuses.length)], { type: "STREAMING", url: "https://www.twitch.tv/discord"})
  }, 10000) 
  });

client.on("channelDelete", (channel) => {
    if (channel.parentID == channel.guild.channels.cache.find((x) => x.name == "»=====MAILBOX=====«").id) {
        const person = channel.guild.members.cache.find((x) => x.id == channel.name)

        if (!person) return;

        let yembed = new discord.MessageEmbed()
            .setAuthor("MAIL DELETED", client.user.displayAvatarURL())
            .setColor('RED')
            .setThumbnail(client.user.displayAvatarURL())
            .setDescription("YOUR MAIL IS DELETED BY STAFF !\n IF YOU HAVE ANY PROBLEM WITH THAT THAN YOU CAN OPEN MAIL AGAIN BY SENDING MESSAGE HERE !")
        return person.send(yembed)

    }


})


client.on("message", async message => {
    if (message.author.bot) return;

    let args = message.content.slice(prefix.length).split(' ');
    let command = args.shift().toLowerCase();


    if (message.guild) {
        if (command == "setup") {
            if (!message.member.hasPermission("ADMINISTRATOR")) {
                return message.channel.send(">>> **YOU NEED `ADMIN PERMISSION` TO SETUP THE MODMAIL SYSTEM !**")
            }

            if (!message.guild.me.hasPermission("ADMINISTRATOR")) {
                return message.channel.send(">>> **BOT NEED `ADMIN PERMISSION` TO SETUP THE MODMAIL SYSTEM !**")
            }


            let role = message.guild.roles.cache.find((x) => x.name == "『MAIL TEAM』")
            let everyone = message.guild.roles.cache.find((x) => x.name == "@everyone")

            if (!role) {
                role = await message.guild.roles.create({
                    data: {
                        name: "『MAIL TEAM』",
                        color: "WHITE"
                    },
                    reason: "ROLE NEEDED FOR MODMAIL SYSTEM"
                })
            }

            await message.guild.channels.create("»=====MAILBOX=====«", {
                type: "category",
                topic: "ALL MAILS WILL BE HERE ! :D",
                permissionOverwrites: [{
                        id: role.id,
                        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    },
                    {
                        id: everyone.id,
                        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
                    }
                ]
            })


            return message.channel.send(">>> ✓ SETUP IS COMPLETED ! :D\n\n `WARNING: PLS DON'T EDIT CATEGORY, CHANNEL OR ROLE **NAME** CREATED BY MODMAIL,OTHERWISE THE MODMAIL SYSTEM WILL NOT WORK !\n SETUP BY BOT:`\n `CATEGORY`: `»=====MAILBOX=====«` \n `ROLE`: `『MAIL TEAM』` ")

        } else if (command == "close") {


            if (message.channel.parentID == message.guild.channels.cache.find((x) => x.name == "»=====MAILBOX=====«").id) {

                const person = message.guild.members.cache.get(message.channel.name)

                if (!person) {
                    return message.channel.send(">>> `ERROR`\nI AM UNABLE TO CLOSE THE CHANNEL !\n`REASON`: THIS ERROR IS COMING BECAUSE PROBALY CHANNEL NAME IS CHANGED IN WHICH MAIL HAS COME !")
                }

                await message.channel.delete()

                let yembed = new discord.MessageEmbed()
                    .setAuthor("MAIL CLOSED", client.user.displayAvatarURL())
                    .setColor("RED")
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setFooter("MAIL IS CLOSED BY " + message.author.username)
                if (args[0]) yembed.setDescription(args.join(" "))

                return person.send(yembed)

            }
        } else if (command == "open") {
            const category = message.guild.channels.cache.find((x) => x.name == "»=====MAILBOX=====«")

            if (!category) {
                return message.channel.send(`>>> MODMAIL SYSTEM WAS NOT SETUP IN THIS SERVER, USE : \`${prefix}setup\``)
            }

            if (!message.member.roles.cache.find((x) => x.name == "『MAIL TEAM』")) {
                return message.channel.send(">>> YOU NEED THIS ROLE `『MAIL TEAM』`\n TO USE THIS COMMAND !")
            }

            if (isNaN(args[0]) || !args.length) {
                return message.channel.send(">>> PLEASE GIVE THE ID OF THE MEMBER YOU WANT TO CONTACT !")
            }

            const target = message.guild.members.cache.find((x) => x.id === args[0])

            if (!target) {
                return message.channel.send(">>> UNKNOWN ID/MEMBER :( \n IS THAT MEMBER WAS IS IN SERVER ?")
            }


            const channel = await message.guild.channels.create(target.id, {
                type: "text",
                parent: category.id,
                topic: `MAIL IS DIRECT OPENED BY **${message.author.username}** TO MAKE CONTACT WITH ${message.author.tag}` })

            let nembed = new discord.MessageEmbed()
                .setAuthor("DETAILS", target.user.displayAvatarURL({ dynamic: true }))
                .setColor("BLUE")
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)
                .addField("NAME :", target.user.username)
                .addField("ACCOUNT CREATION DATE :", target.user.createdAt)
                .addField("DIRECT CONTACT :", "**YES** (MAIL IS OPENED BY STAFF NOT BY MEMBER !)");

            channel.send(nembed)

            let uembed = new discord.MessageEmbed()
                .setAuthor("DIRECT MAIL OPENED")
                .setColor("GREEN")
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`YOU HAVE BEEN CONTACTED TO STAFF TEAM OF **${message.guild.name}**, WRITE YOUR REASON FOR OPENING MAIL AND PLEASE WAIT UNTIL ANY STAFF CONTACT YOU !`);


            target.send(uembed);

            let newEmbed = new discord.MessageEmbed()
                .setDescription("OPENED MAIL AT: <#" + channel + ">")
                .setColor("GREEN");

            return message.channel.send(newEmbed);
        } else if (command == "help") {
            let embed = new discord.MessageEmbed()
                .setAuthor('CRYSTAL MAIL-SYSTEM !', client.user.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription("HELP MENU 🔰 COMMANDS AND INFO !")
                .addField("• DEVELOPER", `\`\`\`yml\nName: ❖MR.JOKER_773#7385 [790133566825955348]\nSERVER Ξ </CRYSTAL HQ> [790133566825955348]\`\`\``)
                .addField("• SOCIAL LINKS", `**[DEV SERVER](https://discord.io/crystal-hq)\`||\`[WEBSITE]()\`||\`[INSTAGRAM]()\`||\`[REDDIT]()\`**`)
                .addField("COMMANDS:")
                .addField(`•${prefix}setup`, "SETUP THE MODMAIL SYSTEM(THIS IS NOT FOR MULTIPLE SERVER.) !", true)
                .addField(`•${prefix}open`, 'LET YOU OPEN THE MAIL TO CONTACT ANYONE WITH HIS ID !', true)
                .addField(`• ${prefix}close`, "CLOSE THE MAIL IN WHICH YOU USE THIS COMMAND !", true)
                .setThumbnail(client.user.displayAvatarURL( { dynamic: true }))
                .setFooter("FROM </CRYSTAL HQ> ! :D");

            return message.channel.send(embed)

        }
    }




    if (message.channel.parentID) {

        const category = message.guild.channels.cache.find((x) => x.name == "»=====MAILBOX=====«")
        if(!category) return;

        if (message.channel.parentID == category.id) {
            let member = message.guild.members.cache.get(message.channel.name)

            if (!member) return message.channel.send('>>> UNABLE TO SEND MESSAGE PROBABLY `DM` MAY BE CLOSE !')

            let lembed = new discord.MessageEmbed()
                .setColor("RED")
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)

            return member.send(lembed)
        }


    }




    if (!message.guild) {
        const guild = await client.guilds.cache.get(ServerID) || await client.guilds.fetch(ServerID).catch(m => {})
        if (!guild || !guild.members.cache.some(x => x.id === message.author.id)) return;

        const category = guild.channels.cache.find((x) => x.name == "»=====MAILBOX=====«")
        if (!category) return;
        const main = guild.channels.cache.find((x) => x.name == message.author.id)


        if (!main) {
            let mx = await guild.channels.create(message.author.id, {
                type: "text",
                parent: category.id,
                topic: `THIS MAIL IS CREATED FOR HELPING  **${message.author.tag} **`
            })

            let sembed = new discord.MessageEmbed()
                .setAuthor("MAIN OPENED")
                .setColor("GREEN")
                .setThumbnail(client.user.displayAvatarURL())
                .setDescription("MAIL HAS BEEN OPENED !\nYOU WILL BE CONTACTED BY STAFF SOONER :D")

            message.author.send(sembed)


            let eembed = new discord.MessageEmbed()
                .setAuthor("DETAILS", message.author.displayAvatarURL({ dynamic: true }))
                .setColor("BLUE")
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(message.content)
                .addField("NAME :", message.author.username)
                .addField("ACCOUNT CREATION DATE :", message.author.createdAt)
                .addField("DIRECT CONTACT :", "**NO** (MAIL IS OPENED BY MEMBER NOT BY STAFF !)")


            return mx.send(eembed)
        }

        let xembed = new discord.MessageEmbed()
            .setColor("WHITE")
            .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(message.content)


        main.send(xembed)

    }




})


client.login(token)
