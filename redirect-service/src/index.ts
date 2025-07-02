import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { limiter, logger } from './config'
import redirectRouter from './redirectRoutes'

const app = express()

const PORT = process.env.PORT

app.listen(PORT, () => {
  logger.info(`redirect service is listening on port ${PORT}`)
})

app.use(cors())
// configure corsOptions later

// Apply the rate limiting middleware to all requests.
app.use(limiter)

app.use(express.json())

app.use(redirectRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error caught:', err.message)
  res.status(500).json({ error: err.message })
})
