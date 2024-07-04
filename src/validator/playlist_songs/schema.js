const Joi = require('joi');

const PostSongToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PostSongToPlaylistPayloadSchema };
