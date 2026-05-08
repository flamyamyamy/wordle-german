import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL
}))

app.use(express.json())

app.post('/api/discord/token', async (req, res) => {
  const { code } = req.body

  if (!code) {
    return res.status(400).json({ error: 'Missing code' })
  }

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID!,
    client_secret: process.env.DISCORD_CLIENT_SECRET!,
    grant_type: 'authorization_code',
    code
  })

  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  })

  const tokenData = await tokenResponse.json()

  if (!tokenResponse.ok) {
    return res.status(400).json(tokenData)
  }

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`
    }
  })

  const user = await userResponse.json()

  res.json({
    access_token: tokenData.access_token,
    user
  })
})

app.listen(3001, () => {
  console.log('Auth server running on port 3001')
})