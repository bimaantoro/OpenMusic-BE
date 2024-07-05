const autoBind = require('auto-bind');

class SongsHandler {
  constructor(songsService, validator) {
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    const songPayload = this._validator.validatePostSongPayload(request.payload);

    const songId = await this._songsService.addSong(songPayload);

    return h.response({
      status: 'success',
      message: 'The song was added successfully.',
      data: {
        songId,
      },
    }).code(201);
  }

  async getSongsHandler(request) {
    const { title = '', performer = '' } = request.query;
    await this._validator.validateSongQuery({ title, performer });

    if (title && performer) {
      const songs = await this._songsService.getSongsByTitleAndPerformer(title, performer);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }

    if (title) {
      const songs = await this._songsService.getSongsByTitle(title);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }

    if (performer) {
      const songs = await this._songsService.getSongsByPerformer(performer);

      return {
        status: 'success',
        data: {
          songs,
        },
      };
    }

    const songs = await this._songsService.getSongs();

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._songsService.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    const { id } = request.params;
    const songPayload = this._validator.validatePutSongPayload(request.payload);

    await this._songsService.editSongById(id, songPayload);

    return {
      status: 'success',
      message: 'The song was updated successfully.',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;

    await this._songsService.deleteSongById(id);

    return {
      status: 'success',
      message: 'The song was deleted successfully.',
    };
  }
}

module.exports = SongsHandler;
