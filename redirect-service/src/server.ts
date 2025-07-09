import { logger } from './config'
import app from './index'

const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  logger.info(`redirect service is listening on port ${PORT}`)
})
