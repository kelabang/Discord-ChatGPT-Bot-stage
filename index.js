import 'dotenv/config'
import { Client, GatewayIntentBits, Partials, ChannelType } from 'discord.js'

import config from './config/config.js'
import { askQuestion } from './chatgpt/chatgpt.js'
import { initDiscordCommands, handle_interaction_ask, handle_interaction_image, handle_interaction_remix, commandExecuters } from './discord/discord_commands.js'
import { splitAndSendResponse, MAX_RESPONSE_CHUNK_LENGTH } from './discord/discord_helpers.js'
import { initDashboard } from './dashboard/dasboard.js'

async function main() {
    await initDiscordCommands()
    initDashboard()

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildIntegrations,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.DirectMessageTyping,
            GatewayIntentBits.MessageContent
        ],
        partials: [Partials.Channel]
    });

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        console.log(new Date())
    });

    client.on("messageCreate", async message => {
        if (config.get("ENABLE_DIRECT_MESSAGES") !== "true" || message.channel.type != ChannelType.DM || message.author.bot) {
            return;
        }
        const user = message.author

        console.log("----Direct Message---")
        console.log("Date    : " + new Date())
        console.log("UserId  : " + user.id)
        console.log("User    : " + user.username)
        console.log("Message : " + message.content)
        console.log("--------------")

        try {
            let sentMessage = await user.send("Hmm, let me think...")
            askQuestion(message.content, async (response) => {
                if (response.length >= MAX_RESPONSE_CHUNK_LENGTH) {
                    splitAndSendResponse(response, user)
                } else {
                    await sentMessage.edit(response)
                }
            })
        } catch (e) {
            console.error(e)
        }
    })

    client.on("interactionCreate", async interaction => {
<<<<<<< HEAD
        console.log({interaction})
        switch (interaction.commandName) {
            case "ngobrol":
                handle_interaction_ask(interaction)
                break;
            case "gambar":
                handle_interaction_image(interaction)
                break
=======
        if(commandExecuters[interaction.commandName]){
            commandExecuters[interaction.commandName](interaction,client)
>>>>>>> upstream/master
        }
    });

    client.login(process.env.DISCORD_BOT_TOKEN);
}

main()
