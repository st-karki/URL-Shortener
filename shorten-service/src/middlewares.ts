import { NextFunction, Request, Response } from 'express'
import { urlSchema } from './validators'

function validateUrl(req: Request, res: Response, next: NextFunction) {
  const { value, error } = urlSchema.validate(req.body)
  if (error) {
    throw new Error('Invalid URL')
  }
  req.body.url = value.user_url
  next()
}

export { validateUrl }
