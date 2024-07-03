const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const InvariantError = require('../exceptions/InvariantError');

class UsersService {
  constructor() {
    this._pool = new Pool();
    this._bcrypt = bcrypt;
  }

  async addUser({ username, password, fullname }) {
    await this.isUsernameExist(username);

    const id = `user-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const hashedPassword = await this._bcrypt.hash(password, 10);

    const query = {
      text: 'INSERT INTO users VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, username, hashedPassword, fullname, createdAt],
    };

    const { rows } = await this._pool.query(query);

    if (!rows.length) {
      throw new InvariantError('Failed to added user');
    }

    return rows[0].id;
  }

  async isUsernameExist(username) {
    const query = {
      text: 'SELECT username FROM users WHERE username = $1',
      values: [username],
    };

    const { rows } = await this._pool.query(query);

    if (rows.length > 0) {
      throw new InvariantError('Failed to add user. Username already exist');
    }
  }
}

module.exports = UsersService;
