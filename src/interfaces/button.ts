import {SlashCommandBuilder} from '@discordjs/builders'
import {BotClient} from '../structures'
import {ButtonInteraction} from 'discord.js'

export default interface IButton {
    customId: string
    execute: (client: BotClient, interaction: ButtonInteraction) => Promise<void>
}