import { DiscordSDK } from '@discord/embedded-app-sdk'

const clientId =
  import.meta.env.VITE_DISCORD_CLIENT_ID

export const discordSdk =
  clientId
    ? new DiscordSDK(clientId)
    : null

export async function setupDiscord() {
  if (!discordSdk) {
    console.log(
      'No Discord Client ID found'
    )

    return
  }

  try {
    await discordSdk.ready()

    console.log(
      'Discord Activity Ready'
    )
  } catch (error) {
    console.log(
      'Discord SDK only works inside Discord'
    )

    console.error(error)
  }
}