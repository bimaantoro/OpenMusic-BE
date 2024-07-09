const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(playlistsService, producerService, validator) {
    this._playlistsService = playlistsService;
    this._producerService = producerService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { playlistId } = request.params;

    await this._playlistsService.isPlaylistExist(playlistId);
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

    const { targetEmail } = this._validator.validatePostExportPlaylistsPayload(request.payload);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._producerService.sendMessage('export:playlists', JSON.stringify(message));

    return h.response({
      status: 'success',
      message: 'Your request is being processed',
    }).code(201);
  }
}

module.exports = ExportsHandler;
