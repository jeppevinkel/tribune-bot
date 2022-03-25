import {SlashCommandBuilder} from '@discordjs/builders'
import {CommandInteraction, MessageAttachment, MessageEmbed, Permissions} from 'discord.js'
import {BotClient} from '../structures'
import {GuildSettings} from '../entities/guildSettings'

export const data = new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Shows the current settings for the guild.')

export const permissions = Permissions.FLAGS.ADMINISTRATOR | Permissions.FLAGS.MANAGE_GUILD

export async function execute(client: BotClient, interaction: CommandInteraction) {
    const guildSettingsRepository = client.getEntityManager().getRepository(GuildSettings)

    if (!interaction.guild) {
        await interaction.reply('This command can only be used in a guild.')
        return
    }

    let guildSettings = await guildSettingsRepository.findOrCreate(interaction.guildId as string)

    const embed = new MessageEmbed()
        .setTitle('Guild Settings!')
        .addField('ModeratorRole', guildSettings.moderatorRole)
        .setColor(0x00ff00)
        .setFooter({text: `Requested by ${interaction.user.tag}`})
        .setTimestamp()
    await interaction.reply({embeds: [embed]})
}