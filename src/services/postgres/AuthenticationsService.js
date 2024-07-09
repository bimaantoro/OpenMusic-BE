const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class AuthenticationsService {
  constructor() {
    this._pool = new Pool();
  }

  async addRefreshToken(refreshToken) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }

  async isRefreshTokenExist(refreshToken) {
    const query = {
      text: 'SELECT refresh_token FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('The refresh token is invalid.');
    }
  }

  async deleteRefreshToken(refreshToken) {
    const query = {
      text: 'DELETE FROM authentications WHERE refresh_token = $1',
      values: [refreshToken],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
