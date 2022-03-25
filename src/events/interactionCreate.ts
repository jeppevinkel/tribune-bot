import {BotClient} from '../structures'
import {CommandInteraction, Interaction} from 'discord.js'

export default async function (client: BotClient, interaction: Interaction) {
    console.log(`[EVENT] interactionCreate: ${interaction.isMessageComponent() ? interaction.componentType : interaction.type}`)
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName)

        if (!command) {
            await interaction.reply({
                content: 'Command not found.',
                ephemeral: true
            })
            return
        }

        try {
            await command.execute(client, interaction)
        } catch (err) {
            console.error('Command execution failed', err)
            await interaction.reply({
                content: 'An error occurred while executing this command.',
                ephemeral: true
            })
        }
    } else if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId)

        if (!button) {
            await interaction.reply({
                content: 'This button does not exist.',
                ephemeral: true
            })
            return
        }

        try {
            await button.execute(client, interaction)
        } catch (err) {
            console.error('Button execution failed', err)
            await interaction.reply({
                content: 'An error occurred while executing this button.',
                ephemeral: true
            })
        }
    }
}