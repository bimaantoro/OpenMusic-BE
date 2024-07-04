const InvariantError = require('../../exceptions/InvariantError');
const { PostSongToPlaylistPayloadSchema } = require('./schema');

const PlaylistSongsValidator = {
  validatePlaylistSongPayload: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = PlaylistSongsValidator;
