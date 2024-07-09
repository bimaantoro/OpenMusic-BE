const InvariantError = require('../../exceptions/InvariantError');
const PostExportPlaylistsSchema = require('./schema');

const ExportsValidator = {
  validatePostExportPlaylistsPayload: (payload) => {
    const validationResult = PostExportPlaylistsSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = ExportsValidator;
