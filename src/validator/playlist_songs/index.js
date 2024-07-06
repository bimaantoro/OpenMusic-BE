const InvariantError = require('../../exceptions/InvariantError');
const { PostSongToPlaylistPayloadSchema, DeleteSongFromPlaylistPayloadSchema } = require('./schema');

const PlaylistSongsValidator = {
  validatePostSongToPlaylistPayload: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
  validateDeleteSongFromPlaylistPayload: (payload) => {
    const validationResult = DeleteSongFromPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = PlaylistSongsValidator;
