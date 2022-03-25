import {BotClient} from '../structures'
import {ButtonInteraction, GuildMember} from 'discord.js'

export const customId = 'rules-accept-button'

export async function execute(client: BotClient, interaction: ButtonInteraction) {
    const member = interaction.member as GuildMember
    if (!member) return

    // if (!member.manageable) {
    //     await interaction.reply({
    //         embeds: [{
    //             title: ':x: You cannot accept the rules',
    //             description: 'You cannot accept the rules because your rank is higher than mine.',
    //             color: 0xFF0000
    //         }],
    //         ephemeral: true
    //     })
    //     return
    // }

    await member.roles.add(process.env.DEFAULT_MEMBER_ROLE ?? '')

    await interaction.reply({
        // content: 'Congratulations, you are now a plebeian.',
        embeds: [
            {
                title: ':tada: You are now a plebeian',
                description: 'You are now a plebeian. You can now use the bot and enjoy the server.',
                color: 0x00FF00
            }
        ],
        ephemeral: true
    })
}