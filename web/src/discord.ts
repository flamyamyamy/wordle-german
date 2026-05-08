import { DiscordSDK } from '@discord/embedded-app-sdk'

const clientId =
  import.meta.env.VITE_DISCORD_CLIENT_ID

let discordSdk: DiscordSDK | null = null

export async function setupDiscord() {
  const isDiscordActivity =
    window.location.search.includes(
      'frame_id'
    )

  if (!isDiscordActivity) {
    console.log(
      'Running outside Discord'
    )

    return
  }

  if (!clientId) {
    console.log(
      'Missing Discord Client ID'
    )

    return
  }

  try {
    discordSdk = new DiscordSDK(
      clientId
    )

    await discordSdk.ready()

    console.log(
      'Discord Activity Ready'
    )
  } catch (error) {
    console.error(error)
  }
}

export { discordSdk }