import dotenv from 'dotenv'
import { rateLimit } from 'express-rate-limit'
import path from 'path'
import pino from 'pino'
import { createClient } from 'redis'

// setup dotenv for env access
dotenv.config({
  path: path.join(__dirname + `../../.env.${process.env.NODE_ENV}`),
})

const logger =
  process.env.NODE_ENV === 'production'
    ? pino(
        {
          level: process.env.LOG_LEVEL ?? 'warn',
          timestamp: pino.stdTimeFunctions.isoTime,
        },
        pino.destination('logs/app.log')
      )
    : pino({
        level: process.env.LOG_LEVEL ?? 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      })

// configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

// setup redis lazy load //
const redis = (async () => {
  const client = createClient({
    url: 'redis://redis:6379',
  })

  client.on('error', (err) => {
    logger.error('Redis Client Error', err)
    process.exit(1)
  })
  await client.connect()
  return client
})()

export { limiter, logger, redis }
