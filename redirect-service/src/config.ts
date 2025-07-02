import dotenv from 'dotenv'
import { rateLimit } from 'express-rate-limit'
import path from 'path'
import pino from 'pino'
import { createClient } from 'redis'

// setup redis lazy load //
const redis = (async () => {
  const client = createClient({
    url: 'redis://redis:6379',
  })

  client.on('error', (err) => {
    console.error('Redis Client Error', err)
  })
  await client.connect()
  return client
})()

// setup dotenv for env access
dotenv.config({
  path: path.join(__dirname + `../../.env.${process.env.NODE_ENV}`),
})

// setup pino for logging
const logger = pino({
  // transport: {
  //   target: 'pino-pretty',
  //   options: {
  //     colorize: true,
  //     translateTime: 'SYS:standard',
  //     ignore: 'pid,hostname',
  //   },
  // },
  level: process.env.LOG_LEVEL || 'debug',
})

// configure rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

export { limiter, logger, redis }
