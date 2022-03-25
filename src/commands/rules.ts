import {SlashCommandBuilder} from '@discordjs/builders'
import {CommandInteraction, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed, Permissions} from 'discord.js'
import {BotClient} from '../structures'

export const data = new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Add the rules to the server')
    .addChannelOption(options => options.setName('channel')
        .setDescription('The channel to send the rules to')
        .setRequired(true))

export const permissions = Permissions.FLAGS.ADMINISTRATOR | Permissions.FLAGS.MANAGE_GUILD

export async function execute(client: BotClient, interaction: CommandInteraction) {
    const channel = interaction.options.getChannel('channel')
    if (channel?.type !== 'GUILD_TEXT') return

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('rules-accept-button')
                .setLabel('Accept')
                .setStyle('SUCCESS')
        )

    await channel.send({
        content: 'Pretends these are some rules...',
        components: [row]
    })

    await interaction.reply({
        content: 'I sent the rules to the channel',
        ephemeral: true,
    })
}