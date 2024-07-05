const autoBind = require('auto-bind');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    autoBind(this);
  }

  async postAuthenticationHandler(request, h) {
    const { username, password } = this._validator
      .validatePostAuthenticationPayload(request.payload);

    const userId = await this._usersService.verifyUserCredential(username, password);

    const accessToken = this._tokenManager.generateAccessToken({ userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ userId });

    await this._authenticationsService.addRefreshToken(refreshToken);

    return h.response({
      status: 'success',
      message: 'Authentication was added successfully.',
      data: {
        accessToken,
        refreshToken,
      },
    }).code(201);
  }

  async putAuthenticationHandler(request) {
    const { refreshToken } = this._validator.validatePutAuthenticationPayload(request.payload);

    await this._authenticationsService.isRefreshTokenExists(refreshToken);
    const { userId } = this._tokenManager.verifyRefreshToken(refreshToken);

    const accessToken = this._tokenManager.generateAccessToken({ userId });

    return {
      status: 'success',
      message: 'The access token was updated successfully.',
      data: {
        accessToken,
      },
    };
  }

  async deleteAuthenticationHandler(request) {
    const { refreshToken } = this._validator.validateDeleteAuthenticationPayload(request.payload);

    await this._authenticationsService.isRefreshTokenExists(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return {
      status: 'success',
      message: 'The refresh token was deleted successfully.',
    };
  }
}

module.exports = AuthenticationsHandler;
