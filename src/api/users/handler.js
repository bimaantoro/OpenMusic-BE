const autoBind = require('auto-bind');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postUserHandler(request, h) {
    const userPayload = this._validator.validateUserPayload(request.payload);

    const userId = await this._service.addUser(userPayload);

    return h.response({
      status: 'success',
      message: 'User was added successfully',
      data: {
        userId,
      },
    }).code(201);
  }
}

module.exports = UsersHandler;
