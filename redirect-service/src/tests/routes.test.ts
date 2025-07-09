import { NextFunction, Request, Response } from 'express'
import { Server } from 'http'
import { RedisClientType } from 'redis'
import supertest from 'supertest'
import app from '..'

// Create mock middleware type
type Middleware = (req: Request, res: Response, next: NextFunction) => void

// Mock the entire config module
jest.mock('../config', () => ({
  redis: Promise.resolve({
    get: jest.fn(),
  }),
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
  limiter: jest.fn((req: Request, res: Response, next: NextFunction) =>
    next()
  ) as Middleware,
}))

// Import the mocked modules
import { limiter, logger, redis } from '../config'

const short_url = 'abcde'
const short_url_wrong = 'abcdef'
const long_url = 'https://user_long_url.com'

describe('GET /:short_url', () => {
  let mockedRedisClient: jest.Mocked<RedisClientType>
  let server: Server

  beforeAll((done) => {
    server = app.listen(0, () => {
      done()
    })
  })

  afterAll((done) => {
    if (server) {
      server.close(done)
    } else {
      done()
    }
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    mockedRedisClient = (await redis) as unknown as jest.Mocked<RedisClientType>
  })

  it('redirect given short url to actual long url', async () => {
    mockedRedisClient.get.mockResolvedValue(long_url)

    const res = await supertest(server).get(`/${short_url}`).redirects(0)

    expect(res.statusCode).toBe(302)
    expect(res.headers.location).toBe(long_url)
    expect(mockedRedisClient.get).toHaveBeenCalledWith(short_url)
    expect(mockedRedisClient.get).toHaveBeenCalledTimes(1)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it('throw error when short url does not exits in redis db', async () => {
    mockedRedisClient.get.mockResolvedValue(null)

    const res = await supertest(server).get(`/${short_url_wrong}`).redirects(0)

    expect(res.statusCode).toBe(500)
    expect(res.body.error).toBe('URL not found')
    expect(mockedRedisClient.get).toHaveBeenCalledWith(short_url_wrong)
    expect(mockedRedisClient.get).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalled()
  })

  it('applies rate limiting', async () => {
    const mockLimiter = limiter as jest.MockedFunction<typeof limiter>

    await supertest(server).get(`/${short_url}`).redirects(0)

    expect(mockLimiter).toHaveBeenCalled()
  })
})
