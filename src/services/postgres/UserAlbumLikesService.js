const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class UserAlbumLikesService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addUserAlbumLike(userId, albumId) {
    const id = `likes-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    await this._pool.query(query);

    await this._cacheService.delete(`album:likes:${albumId}`);
  }

  async deleteUserAlbumLike(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    await this._pool.query(query);

    await this._cacheService.delete(`album:likes:${albumId}`);
  }

  async isUserAlreadyLikedAlbum(userId, albumId) {
    const query = {
      text: 'SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const { rows } = await this._pool.query(query);

    return rows.length > 0;
  }

  async countLikesByAlbumId(albumId) {
    try {
      const result = await this._cacheService.get(`album:likes:${albumId}`);

      return {
        source: 'cache',
        count: Number(result),
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(user_id) as result FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const { rows } = await this._pool.query(query);

      const count = Number(rows[0].result);

      await this._cacheService.set(`album:likes:${albumId}`, count);

      return {
        source: 'database',
        count,
      };
    }
  }
}

module.exports = UserAlbumLikesService;
