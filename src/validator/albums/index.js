const InvariantError = require('../../exceptions/InvariantError');
const { PostAlbumPayloadSchema, PutAlbumPayloadSchema } = require('./schema');

const AlbumsValidator = {
  validatePostAlbumPayload: (payload) => {
    const validationResult = PostAlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
  validatePutAlbumPayload: (payload) => {
    const validationResult = PutAlbumPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = AlbumsValidator;
