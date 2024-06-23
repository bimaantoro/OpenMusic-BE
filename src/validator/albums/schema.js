const Joi = require('joi');
const { currentYear } = require('../../utils');

const PostAlbumPayloadSchema = Joi.object({
  name: Joi.string().min(1).required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
});

const PutAlbumPayloadSchema = Joi.object({
  name: Joi.string().min(1).required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
});

module.exports = { PostAlbumPayloadSchema, PutAlbumPayloadSchema };
