import { Router } from 'express'
import { validateUrl } from './middlewares'
import shortenUrlHandler from './urlController'

const urlRouter = Router()

urlRouter.post('/shorten', validateUrl, shortenUrlHandler)

export default urlRouter
