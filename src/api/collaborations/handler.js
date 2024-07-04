const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, playlistsService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postCollaborationHandler(request, h) {
    const { playlistId, userId } = this._validator
      .validatePostCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    return h.response({
      status: 'success',
      message: 'Collaboration was added successfully',
      data: {
        collaborationId,
      },
    }).code(201);
  }

  async deleteCollaborationHandler(request) {
    const { playlistId, userId } = this._validator
      .validateDeleteCollaborationPayload(request.payload);

    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Collaboration deleted successfully',
    };
  }
}

module.exports = CollaborationsHandler;
