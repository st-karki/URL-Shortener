import { NextFunction, Request, Response } from 'express'
import { Server } from 'http'
import { RedisClientType } from 'redis'
import supertest from 'supertest'

// Create mock middleware type
type Middleware = (req: Request, res: Response, next: NextFunction) => void

// Move the app import after the mocks
const mockRedisClient = {
  set: jest.fn().mockResolvedValue('OK'),
  get: jest.fn(),
}

// Mock the entire config module
jest.mock('../config', () => ({
  redis: Promise.resolve(mockRedisClient),
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

// Mock nanoid
jest.mock('nanoid', () => ({
  nanoid: () => 'mockedShortUrl123',
}))

// First mock the schema
jest.mock('../validators.ts', () => ({
  urlSchema: {
    validate: jest.fn((input) => {
      // Simulate Joi validation logic
      if (!input.user_url || !input.user_url.startsWith('http')) {
        return {
          error: new Error('Invalid URL'),
          value: input,
        }
      }
      return {
        value: input,
        error: null,
      }
    }),
  },
}))

// Then import the mocked schema

// Import app and mocked modules after the mock setup
import app from '..'
import { redis } from '../config'

describe('POST /shorten', () => {
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

  it('convert long url to short url', async () => {
    // Add a valid URL for testing
    const testUrl = 'https://example.com'

    const res = await supertest(server) // Use server instead of app
      .post('/shorten')
      .send({
        user_url: testUrl,
      })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('data')
    expect(res.body.data).toBeDefined()
    expect(mockedRedisClient.set).toHaveBeenCalled()
  })

  it('should return error for invalid URL', async () => {
    const res = await supertest(server).post('/shorten').send({
      user_url: '',
    })

    expect(res.status).toBe(500)
    expect(res.body).toHaveProperty('error')
    expect(res.body.error).toBe('Invalid URL')
  })
})
