const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');

class TokenManager {
  constructor() {
    this._jwt = Jwt.token;
  }

  generateAccessToken(payload) {
    return this._jwt.generate(payload, process.env.ACCESS_TOKEN_KEY);
  }

  generateRefreshToken(payload) {
    return this._jwt.generate(payload, process.env.REFRESH_TOKEN_KEY);
  }

  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      this._jwt.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Invalid refresh token');
    }
  }
}

module.exports = TokenManager;
