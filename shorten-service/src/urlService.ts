import { nanoid } from 'nanoid'
import { redis } from './config'

const shortenUrlService = async (user_url: string) => {
  try {
    const short_url = nanoid()
    const client = await redis
    await client.set(short_url, user_url)
    return short_url
  } catch (error) {
    throw error
  }
}

export default shortenUrlService
