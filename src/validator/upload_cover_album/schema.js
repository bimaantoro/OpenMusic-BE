const Joi = require('joi');

const PutAlbumCoverPayloadSchema = Joi.object({
  cover: Joi.object({
    hapi: Joi.object({
      filename: Joi.string().required(),
      headers: Joi.object({
        'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
      }).unknown(),
    }).unknown(),
  }).unknown().required(),
});

module.exports = { PutAlbumCoverPayloadSchema };
