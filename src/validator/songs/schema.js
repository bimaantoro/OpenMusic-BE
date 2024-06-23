const Joi = require('joi');
const { currentYear } = require('../../utils');

const PostSongPayloadSchema = Joi.object({
  title: Joi.string().min(1).required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
  genre: Joi.string().min(1).required(),
  performer: Joi.string().min(1).required(),
  duration: Joi.number().integer().empty(''),
  albumId: Joi.string().empty(''),
});

const PutSongPayloadSchema = Joi.object({
  title: Joi.string().min(1).required(),
  year: Joi.number().integer().min(1900).max(currentYear)
    .required(),
  genre: Joi.string().min(1).required(),
  performer: Joi.string().min(1).required(),
  duration: Joi.number().integer().empty(''),
  albumId: Joi.string().empty(''),
});

const SongQuerySchema = Joi.object({
  title: Joi.string().empty(''),
  performer: Joi.string().empty(''),
});

module.exports = { PostSongPayloadSchema, PutSongPayloadSchema, SongQuerySchema };
