const InvariantError = require('../../exceptions/InvariantError');
const { PostCollaborationPayloadSchema, DeleteCollaborationPayloadSchema } = require('./schema');

const CollaborationsValidator = {
  validatePostCollaborationPayload: (payload) => {
    const validationResult = PostCollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
  validateDeleteCollaborationPayload: (payload) => {
    const validationResult = DeleteCollaborationPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }

    return validationResult.value;
  },
};

module.exports = CollaborationsValidator;
