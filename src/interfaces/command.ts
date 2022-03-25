import {SlashCommandBuilder} from '@discordjs/builders'
import {BotClient} from '../structures'
import {CommandInteraction} from 'discord.js'

export default interface ICommand {
    data: SlashCommandBuilder
    execute: (client: BotClient, interaction: CommandInteraction) => Promise<void>
    permissions?: bigint
}