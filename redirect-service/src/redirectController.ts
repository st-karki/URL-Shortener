import { NextFunction, Request, Response } from 'express'
import { logger } from './config'
import redirectUrlService from './redirectService'

const redirectUrlHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { short_url } = req.params
    if (typeof short_url !== 'string') throw new Error('Invalid Short Link')
    const long_url = await redirectUrlService(short_url)
    res.redirect(long_url)
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

export default redirectUrlHandler
