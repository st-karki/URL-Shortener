import { NextFunction, Request, Response } from 'express'
import { logger } from './config'
import shortenUrlService from './urlService'

const shortenUrlHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body
    const short_url = await shortenUrlService(url)
    res.send({ data: short_url })
  } catch (error) {
    logger.info(error)
    throw error
  }
}

export default shortenUrlHandler
