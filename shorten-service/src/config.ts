import dotenv from 'dotenv'
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

export { logger, redis }
