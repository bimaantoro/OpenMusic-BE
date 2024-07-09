const Joi = require('joi');

const PostExportPlaylistsSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: true }).required(),
});

module.exports = PostExportPlaylistsSchema;
