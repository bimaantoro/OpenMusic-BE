const InvariantError = require('../../exceptions/InvariantError');
const { PutAlbumCoverPayloadSchema } = require('./schema');

const UploadCoverAlbumValidator = {
  validatePutAlbumCoverPayload: (payload) => {
    const validationResult = PutAlbumCoverPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadCoverAlbumValidator;
