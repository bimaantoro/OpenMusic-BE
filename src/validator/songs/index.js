const InvariantError = require('../../exceptions/InvariantError');
const { PostSongPayloadSchema, PutSongPayloadSchema, SongQuerySchema } = require('./schema');

const SongsValidator = {
  validatePostSongPayload: (payload) => {
    const validationResult = PostSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
  validatePutSongPayload: (payload) => {
    const validationResult = PutSongPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
  validateSongQuery: (query) => {
    const validationResult = SongQuerySchema.validate(query);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = SongsValidator;
