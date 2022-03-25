import {SlashCommandBuilder} from '@discordjs/builders'
import {CommandInteraction, MessageAttachment, MessageEmbed} from 'discord.js'
import {BotClient} from '../structures'

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping!')

export async function execute(client: BotClient, interaction: CommandInteraction) {
    const ping = Date.now() - interaction.createdTimestamp
    const embed = new MessageEmbed()
        .setTitle('Pong!')
        .setDescription(`${ping}ms`)
        .setColor(0x00FF00)
        .setFooter({text: `Requested by ${interaction.user.tag}`})
        .setTimestamp()
    await interaction.reply({embeds: [embed]})
}