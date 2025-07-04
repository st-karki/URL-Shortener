import Joi from 'joi'

const urlSchema = Joi.object({
  user_url: Joi.string().uri().required(),
})

export { urlSchema }
