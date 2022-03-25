import {BotClient} from '../structures'
import {Role} from 'discord.js'

export default async function (client: BotClient, role: Role) {
    client.updatePermissionsForGuild(role.guild)
        .catch(error => {
            console.error(`[roleUpdate] ${error}`)
        })
}

export const once = false