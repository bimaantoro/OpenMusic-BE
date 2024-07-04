const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');

class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(playlistId, songId) {
    const id = `playlistsongs-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3)',
      values: [id, playlistId, songId],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to add song to playlist');
    }
  }

  async getSongsByPlaylistId(playlistId) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM playlist_songs
            LEFT JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1
            GROUP BY playlist_songs.song_id, songs.id`,
      values: [playlistId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = PlaylistSongsService;
