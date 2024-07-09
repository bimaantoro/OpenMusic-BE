const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
const { config } = require('../utils/config');

class TokenManager {
  constructor() {
    this._jwt = Jwt.token;
  }

  generateAccessToken(payload) {
    return this._jwt.generate(payload, config.jwtToken.accessToken.key);
  }

  generateRefreshToken(payload) {
    return this._jwt.generate(payload, config.jwtToken.refreshToken.key);
  }

  verifyRefreshToken(refreshToken) {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      this._jwt.verifySignature(artifacts, config.jwtToken.refreshToken.key);
      const { payload } = artifacts.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Invalid refresh token');
    }
  }
}

module.exports = TokenManager;
