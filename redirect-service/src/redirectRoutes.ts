import { Router } from 'express'
import redirectUrlHandler from './redirectController'

const redirectRouter = Router()

redirectRouter.get('/:short_url', redirectUrlHandler)

export default redirectRouter
