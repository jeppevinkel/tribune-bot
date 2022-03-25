import {BotClient} from '../structures'

export default async function (client: BotClient) {
  console.log('Ready!')

  await client.registerCommandsForAllGuilds()
}

export const once = true