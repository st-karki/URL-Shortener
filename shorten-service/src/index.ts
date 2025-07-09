import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { logger } from './config'
import urlRouter from './urlRoutes'

const app = express()

app.use(cors())
// configure corsOptions later

app.use(express.json())

app.use(urlRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV == 'production') {
    res.status(500).send('Internal Server Error')
  }
  logger.error('Error caught:', err.message)
  res.status(500).send({ error: err.message })
})

export default app
