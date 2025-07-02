import { redis } from './config'

const redirectUrlService = async (user_url: string) => {
  try {
    const client = await redis
    const long_url = await client.get(user_url)
    if (!long_url) {
      throw new Error('URL not found')
    }
    return long_url
  } catch (error) {
    throw error
  }
}

export default redirectUrlService
