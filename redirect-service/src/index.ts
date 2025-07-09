import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { limiter, logger } from './config'
import redirectRouter from './redirectRoutes'

const app = express()

app.use(cors())
app.use(limiter)
app.use(express.json())
app.use(redirectRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV == 'production') {
    res.status(500).send('Internal Server Error')
  }
  logger.error('Error caught:', err.message)
  res.status(500).json({ error: err.message })
})

export default app
