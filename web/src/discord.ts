import { DiscordSDK } from '@discord/embedded-app-sdk'

const clientId = import.meta.env.VITE_DISCORD_CLIENT_ID
const apiUrl = import.meta.env.VITE_API_URL

export const discordSdk = new DiscordSDK(clientId)

export async function setupDiscordAuth() {
  const isDiscordActivity =
    window.location.search.includes('frame_id')

  if (!isDiscordActivity) {
    console.log('Running outside Discord')
    return null
  }

  await discordSdk.ready()

  const { code } = await discordSdk.commands.authorize({
    client_id: clientId,
    response_type: 'code',
    state: '',
    prompt: 'none',
    scope: ['identify']
  })

  const response = await fetch(`${apiUrl}/api/discord/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ code })
  })

  const data = await response.json()

  await discordSdk.commands.authenticate({
    access_token: data.access_token
  })

  return data.user
}