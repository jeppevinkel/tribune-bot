import dotenv from 'dotenv'

dotenv.config()

import {Client, CommandInteraction, Intents, Interaction, Snowflake, SnowflakeUtil} from 'discord.js'
import {BotClient} from './structures'

if (process.env.DISCORD_TOKEN == undefined || process.env.DISCORD_TOKEN == '') {
    console.error('Please set a DISCORD_TOKEN in the .env file')
    process.exit()
}

const client = new BotClient({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.login(process.env.DISCORD_TOKEN).then()