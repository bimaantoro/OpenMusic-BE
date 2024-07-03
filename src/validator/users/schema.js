const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50)
    .required(),
  password: Joi.string().min(3).required(),
  fullname: Joi.string().min(3).required(),
});

module.exports = { UserPayloadSchema };
