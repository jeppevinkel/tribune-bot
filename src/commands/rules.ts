import {SlashCommandBuilder} from '@discordjs/builders'
import {CommandInteraction, MessageActionRow, MessageAttachment, MessageButton, MessageEmbed, Permissions} from 'discord.js'
import {BotClient} from '../structures'
import {GuildRule} from '../entities/guildRule'

export const data = new SlashCommandBuilder()
    .setName('rules')
    .setDescription('Add the rules to the server')
    .addSubcommand(subCommand => subCommand.setName('add')
        .setDescription('Add a rule to the server')
        .addStringOption(option => option.setName('rule')
            .setDescription('The rule to add')
            .setRequired(true)
        ))
    .addSubcommand(subCommand => subCommand.setName('remove')
        .setDescription('Remove a rule from the server')
        .addIntegerOption(option => option.setName('rule')
            .setDescription('The rule to remove')
            .setRequired(true)
        ))
    .addSubcommand(subCommand => subCommand.setName('list')
        .setDescription('List all rules in the server')
    )
    .addSubcommand(subCommand => subCommand.setName('post')
        .setDescription('Post the rules to the server')
        .addChannelOption(option => option.setName('channel')
            .setDescription('The channel to send the rules to')
            .setRequired(true))
    )

export const permissions = Permissions.FLAGS.ADMINISTRATOR | Permissions.FLAGS.MANAGE_GUILD

export async function execute(client: BotClient, interaction: CommandInteraction) {
    const subCommand = interaction.options.getSubcommand()
    if (!interaction.guildId) return interaction.reply({content: 'This command can only be used in a server', ephemeral: true})
    if (!subCommand) return interaction.reply({content: 'You must specify a subcommand', ephemeral: true})


    switch (subCommand) {
        case 'add': {
            const rule = interaction.options.getString('rule')
            if (!rule) return interaction.reply({content: 'You must provide a rule to add', ephemeral: true})
            const guildRulesRepository = client.getEntityManager().getRepository(GuildRule)

            await guildRulesRepository.insertByGuild(interaction.guildId.toString(), rule)

            await interaction.reply({content: 'Rule added', ephemeral: true})
            break
        }
        case 'remove': {
            const rule = interaction.options.getInteger('rule')
            if (!rule) return interaction.reply({content: 'You must provide a rule to remove', ephemeral: true})
            const guildRulesRepository = client.getEntityManager().getRepository(GuildRule)
            const rules = await guildRulesRepository.findByGuild(interaction.guildId.toString())

            if (rules.length <= rule) return interaction.reply({content: 'Rule does not exist', ephemeral: true})

            await guildRulesRepository.removeAndFlush(rules[rule])

            await interaction.reply({content: 'Rule removed', ephemeral: true})
            break
        }
        case 'list': {
            const guildRulesRepository = client.getEntityManager().getRepository(GuildRule)
            const rules = await guildRulesRepository.findByGuild(interaction.guildId.toString())

            const embed = new MessageEmbed()
                .setTitle('Rules')
                .setColor(0x00FF00)
                .setDescription(rules.map((rule, i) => `(${i}) ${rule.rule}`).join('\n'))
                .setFooter({text: 'This is a list of rules for this server'})

            await interaction.reply({embeds: [embed], ephemeral: true})
            break
        }
        case 'post': {
            const channel = interaction.options.getChannel('channel')
            if (channel?.type !== 'GUILD_TEXT') return interaction.reply({content: 'The channel must be a text channel', ephemeral: true})

            const guildRulesRepository = client.getEntityManager().getRepository(GuildRule)
            const rules = await guildRulesRepository.findByGuild(interaction.guildId.toString())

            if (rules.length === 0) return interaction.reply({content: 'There are no rules to post', ephemeral: true})

            const row = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('rules-accept-button')
                        .setLabel('Accept')
                        .setStyle('SUCCESS')
                )

            await channel.send({
                content: rules.map((rule) => `- ${rule.rule}`).join('\n'),
                components: [row]
            })

            await interaction.reply({
                content: 'I sent the rules to the channel',
                ephemeral: true,
            })
            break
        }
    }
}