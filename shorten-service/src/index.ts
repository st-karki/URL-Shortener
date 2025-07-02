import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { logger } from './config'
import urlRouter from './urlRoutes'

const app = express()

const PORT = process.env.PORT

app.listen(PORT, () => {
  logger.info(`shorten service is listening on port ${PORT}`)
})

app.use(cors())
// configure corsOptions later

app.use(express.json())

app.use(urlRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error caught:', err.message)
  res.status(500).json({ error: err.message })
})
